import { requirePermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/card";
import { BarraHorizontal } from "@/components/relatorios/barra-horizontal";
import { calcularValorOrcamento, ultimosMeses } from "@/lib/relatorios/utils";

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  aguardando_aprovacao: "Aguardando aprovação",
  enviado: "Enviado",
  aprovado: "Aprovado",
  recusado: "Recusado",
  vencido: "Vencido",
  cancelado: "Cancelado",
};

export default async function RelatoriosPage() {
  const context = await requirePermissao("relatorios.visualizar");
  const supabase = await createClient();

  const meses = ultimosMeses(6);
  const inicioJanela = meses[0].inicio.toISOString();

  const [
    { data: orcamentos },
    { data: itensOrcamentos },
    { data: clientes },
    { count: calculosBox },
    { count: calculosSacada },
    { count: calculosPorta },
    { count: calculosJanela },
  ] = await Promise.all([
    supabase
      .from("orcamentos")
      .select("id, status, desconto_valor, desconto_percentual, created_at")
      .eq("empresa_id", context.empresa.id)
      .gte("created_at", inicioJanela),
    supabase
      .from("orcamento_itens")
      .select("orcamento_id, quantidade, preco_unitario")
      .eq("empresa_id", context.empresa.id),
    supabase
      .from("clientes")
      .select("id, created_at")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .gte("created_at", inicioJanela),
    supabase.from("calculos_box").select("id", { count: "exact", head: true }).eq("empresa_id", context.empresa.id),
    supabase.from("calculos_sacada").select("id", { count: "exact", head: true }).eq("empresa_id", context.empresa.id),
    supabase.from("calculos_porta").select("id", { count: "exact", head: true }).eq("empresa_id", context.empresa.id),
    supabase.from("calculos_janela").select("id", { count: "exact", head: true }).eq("empresa_id", context.empresa.id),
  ]);

  const itensPorOrcamento = new Map<string, { quantidade: number; preco_unitario: number }[]>();
  for (const item of itensOrcamentos ?? []) {
    const lista = itensPorOrcamento.get(item.orcamento_id) ?? [];
    lista.push({ quantidade: item.quantidade, preco_unitario: item.preco_unitario });
    itensPorOrcamento.set(item.orcamento_id, lista);
  }

  const orcamentosComValor = (orcamentos ?? []).map((o) => ({
    ...o,
    valor: calcularValorOrcamento(itensPorOrcamento.get(o.id) ?? [], o.desconto_valor, o.desconto_percentual),
  }));

  const totalOrcado = orcamentosComValor.reduce((a, o) => a + o.valor, 0);
  const aprovados = orcamentosComValor.filter((o) => o.status === "aprovado");
  const totalAprovado = aprovados.reduce((a, o) => a + o.valor, 0);
  const naoCancelados = orcamentosComValor.filter((o) => o.status !== "cancelado" && o.status !== "rascunho");
  const taxaConversao = naoCancelados.length > 0 ? (aprovados.length / naoCancelados.length) * 100 : 0;

  const porStatus = Object.entries(STATUS_LABEL).map(([status, label]) => {
    const doStatus = orcamentosComValor.filter((o) => o.status === status);
    return { status, label, quantidade: doStatus.length, valor: doStatus.reduce((a, o) => a + o.valor, 0) };
  }).filter((s) => s.quantidade > 0);

  const aprovadoPorMes = meses.map((m) => {
    const doMes = aprovados.filter((o) => {
      const d = new Date(o.created_at);
      return d >= m.inicio && d < m.fim;
    });
    return { label: m.label, valor: doMes.reduce((a, o) => a + o.valor, 0) };
  });

  const clientesPorMes = meses.map((m) => {
    const qtd = (clientes ?? []).filter((c) => {
      const d = new Date(c.created_at);
      return d >= m.inicio && d < m.fim;
    }).length;
    return { label: m.label, valor: qtd };
  });

  const calculosPorTipo = [
    { label: "Box", valor: calculosBox ?? 0 },
    { label: "Sacada", valor: calculosSacada ?? 0 },
    { label: "Porta", valor: calculosPorta ?? 0 },
    { label: "Janela", valor: calculosJanela ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Relatórios</h1>
        <p className="text-sm text-muted">Últimos 6 meses, calculado a partir dos dados reais do sistema.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Orçamentos no período" value={String(orcamentosComValor.length)} />
        <StatCard label="Valor orçado" value={`R$ ${totalOrcado.toFixed(2)}`} />
        <StatCard label="Valor aprovado" value={`R$ ${totalAprovado.toFixed(2)}`} />
        <StatCard label="Taxa de conversão" value={`${taxaConversao.toFixed(1)}%`} hint="Aprovados sobre não cancelados/rascunho" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Valor aprovado por mês</h2>
          <BarraHorizontal dados={aprovadoPorMes.map((m) => ({ label: m.label, valor: m.valor, destaque: `R$ ${m.valor.toFixed(2)}` }))} />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Clientes novos por mês</h2>
          <BarraHorizontal dados={clientesPorMes} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Orçamentos por status (6 meses)</h2>
          <ul className="space-y-2 text-sm">
            {porStatus.map((s) => (
              <li key={s.status} className="flex items-center justify-between">
                <span className="text-foreground">{s.label}</span>
                <span className="text-muted">{s.quantidade}x · R$ {s.valor.toFixed(2)}</span>
              </li>
            ))}
            {porStatus.length === 0 && <li className="text-muted">Nenhum orçamento no período.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Cálculos técnicos por tipo (total)</h2>
          <BarraHorizontal dados={calculosPorTipo} />
        </div>
      </div>
    </div>
  );
}
