import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: totalClientes },
    { count: clientesNovos },
    { count: usuariosAtivos },
    { count: obrasAbertas },
    { count: fornecedoresAtivos },
    { data: itensEstoque },
    { count: sistemasCadastrados },
    { count: calculosBox },
    { count: calculosSacada },
    { count: calculosPorta },
    { count: calculosJanela },
    { count: totalOrcamentos },
  ] = await Promise.all([
    supabase.from("clientes").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("clientes")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .gte("created_at", startOfMonth.toISOString()),
    supabase.from("usuarios").select("id", { count: "exact", head: true }).eq("ativo", true),
    supabase
      .from("obras")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .not("status", "in", "(finalizado,garantia)"),
    supabase.from("fornecedores").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("itens_estoque")
      .select("quantidade_atual, quantidade_minima")
      .is("deleted_at", null),
    supabase.from("sistemas").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("calculos_box").select("id", { count: "exact", head: true }),
    supabase.from("calculos_sacada").select("id", { count: "exact", head: true }),
    supabase.from("calculos_porta").select("id", { count: "exact", head: true }),
    supabase.from("calculos_janela").select("id", { count: "exact", head: true }),
    supabase.from("orcamentos").select("id", { count: "exact", head: true }),
  ]);

  const totalCalculos =
    (calculosBox ?? 0) + (calculosSacada ?? 0) + (calculosPorta ?? 0) + (calculosJanela ?? 0);

  const passos = [
    {
      titulo: "Monte seu catálogo",
      desc: "Cadastre os sistemas e kits que sua vidraçaria trabalha.",
      feito: (sistemasCadastrados ?? 0) > 0,
      href: "/catalogo/novo",
    },
    {
      titulo: "Cadastre seu primeiro cliente",
      desc: "Dados de contato pra vincular obras e orçamentos.",
      feito: (totalClientes ?? 0) > 0,
      href: "/clientes/novo",
    },
    {
      titulo: "Faça um cálculo técnico",
      desc: "Box, sacada, porta ou janela — o sistema calcula tudo sozinho.",
      feito: totalCalculos > 0,
      href: "/calculadoras",
    },
    {
      titulo: "Gere um orçamento",
      desc: "Monte a proposta e baixe o PDF pra enviar ao cliente.",
      feito: (totalOrcamentos ?? 0) > 0,
      href: "/orcamentos",
    },
    {
      titulo: "Convide sua equipe",
      desc: "Cada pessoa entra com o perfil certo (vendedor, medidor, instalador...).",
      feito: (usuariosAtivos ?? 0) > 1,
      href: "/usuarios",
    },
  ];
  const passosFeitos = passos.filter((p) => p.feito).length;
  const mostrarPrimeirosPassos = passosFeitos < passos.length;

  const itensEstoqueBaixo = (itensEstoque ?? []).filter(
    (i) => i.quantidade_atual <= i.quantidade_minima
  ).length;

  const { data: orcamentosMes } = await supabase
    .from("orcamentos")
    .select("id, status, desconto_percentual, desconto_valor")
    .eq("empresa_id", context.empresa.id)
    .neq("status", "cancelado")
    .gte("created_at", startOfMonth.toISOString());

  const idsOrcamentosMes = (orcamentosMes ?? []).map((o) => o.id);
  const { data: itensOrcamentosMes } = idsOrcamentosMes.length
    ? await supabase
        .from("orcamento_itens")
        .select("orcamento_id, quantidade, preco_unitario")
        .in("orcamento_id", idsOrcamentosMes)
    : { data: [] };

  const subtotalPorOrcamento = new Map<string, number>();
  for (const item of itensOrcamentosMes ?? []) {
    subtotalPorOrcamento.set(
      item.orcamento_id,
      (subtotalPorOrcamento.get(item.orcamento_id) ?? 0) + item.quantidade * item.preco_unitario
    );
  }

  let valorTotalOrcado = 0;
  let valorTotalAprovado = 0;
  for (const o of orcamentosMes ?? []) {
    const subtotal = subtotalPorOrcamento.get(o.id) ?? 0;
    const desconto = o.desconto_valor + (subtotal * o.desconto_percentual) / 100;
    const final = Math.max(subtotal - desconto, 0);
    valorTotalOrcado += final;
    if (o.status === "aprovado") valorTotalAprovado += final;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">
          Olá, {context.usuario.nome.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted">
          Visão geral de {context.empresa.nome_fantasia || context.empresa.razao_social}.
        </p>
      </div>

      {mostrarPrimeirosPassos && (
        <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-accent-2/5 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-primary">
                Primeiros passos no sistema
              </h2>
              <p className="text-xs text-muted">
                Siga essa ordem pra colocar sua vidraçaria pra rodar no sistema.
              </p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
              {passosFeitos}/{passos.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {passos.map((passo, i) => (
              <Link
                key={passo.titulo}
                href={passo.href}
                className={`group relative rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  passo.feito
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-surface hover:border-accent/40 hover:shadow-[0_8px_20px_rgba(76,29,149,0.1)]"
                }`}
              >
                <span
                  className={`mb-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    passo.feito ? "bg-success text-white" : "bg-border text-muted group-hover:bg-accent group-hover:text-white"
                  }`}
                >
                  {passo.feito ? "✓" : i + 1}
                </span>
                <p className="text-sm font-semibold text-foreground">{passo.titulo}</p>
                <p className="mt-1 text-xs text-muted">{passo.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Módulos ativos
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Clientes ativos" value={String(totalClientes ?? 0)} />
          <StatCard label="Clientes novos no mês" value={String(clientesNovos ?? 0)} />
          <StatCard label="Obras em andamento" value={String(obrasAbertas ?? 0)} />
          <StatCard label="Usuários ativos" value={String(usuariosAtivos ?? 0)} />
          <StatCard label="Fornecedores ativos" value={String(fornecedoresAtivos ?? 0)} />
          <StatCard label="Sistemas no catálogo" value={String(sistemasCadastrados ?? 0)} />
          <StatCard
            label="Cálculos técnicos feitos"
            value={String((calculosBox ?? 0) + (calculosSacada ?? 0) + (calculosPorta ?? 0) + (calculosJanela ?? 0))}
            hint="Box, sacada, porta e janela"
          />
          <StatCard label="Orçamentos no mês" value={String(orcamentosMes?.length ?? 0)} />
          <StatCard label="Valor orçado no mês" value={`R$ ${valorTotalOrcado.toFixed(2)}`} />
          <StatCard label="Valor aprovado no mês" value={`R$ ${valorTotalAprovado.toFixed(2)}`} />
          <StatCard
            label="Itens com estoque baixo"
            value={String(itensEstoqueBaixo ?? 0)}
            hint={itensEstoqueBaixo ? "Verifique o módulo de Estoque" : undefined}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Atalhos
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/clientes/novo">
            <Button>Novo cliente</Button>
          </Link>
          <Link href="/obras/novo">
            <Button variant="secondary">Nova obra</Button>
          </Link>
          <Link href="/calculadoras/box/novo">
            <Button variant="secondary">Calcular box</Button>
          </Link>
          <Link href="/calculadoras/sacada/novo">
            <Button variant="secondary">Calcular sacada</Button>
          </Link>
          <Link href="/calculadoras/porta/novo">
            <Button variant="secondary">Calcular porta</Button>
          </Link>
          <Link href="/calculadoras/janela/novo">
            <Button variant="secondary">Calcular janela</Button>
          </Link>
          <Link href="/catalogo/novo">
            <Button variant="secondary">Novo sistema</Button>
          </Link>
          <Link href="/estoque/novo">
            <Button variant="secondary">Novo item de estoque</Button>
          </Link>
          <Link href="/fornecedores/novo">
            <Button variant="secondary">Novo fornecedor</Button>
          </Link>
          <Link href="/usuarios">
            <Button variant="secondary">Convidar usuário</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-surface p-5">
        <p className="text-sm text-foreground">
          Esses números acima são só uma parte do sistema — Produção, Financeiro, Agenda,
          Estoque e outros módulos têm suas próprias telas no menu, com dados reais também.
          Alguns detalhes menores de cada módulo ainda estão em evolução.
        </p>
        <Link
          href="/progresso"
          className="mt-2 inline-block text-sm font-medium text-accent-dark hover:underline"
        >
          Ver progresso completo dos módulos →
        </Link>
      </div>
    </div>
  );
}
