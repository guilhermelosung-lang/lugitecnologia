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
  ]);

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
          Medição digital, calculadoras de esquadrias/serralheria, plano de corte, produção,
          instalação, assinatura digital e financeiro ainda não foram implementados — os cards
          desses módulos não aparecem aqui de propósito, para não mostrar números
          inventados.
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
