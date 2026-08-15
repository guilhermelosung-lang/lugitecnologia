import { notFound } from "next/navigation";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { BarraDesenho } from "@/components/plano-corte/barra-desenho";
import type { ResultadoPlanoCortePerfis } from "@/lib/calc/plano-corte-perfis";
import { formatDateTime } from "@/lib/utils";

export default async function PlanoCortePerfisDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: plano } = await supabase
    .from("planos_corte_perfis")
    .select("*, obras(nome)")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!plano) notFound();

  const resultado = plano.resultado as unknown as ResultadoPlanoCortePerfis;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-sm text-muted">{plano.obras?.nome ?? "Sem obra"}</p>
        <h1 className="font-heading text-2xl font-bold text-primary">{plano.nome || "Plano de corte de perfis"}</h1>
        <p className="text-sm text-muted">
          Calculado em {formatDateTime(plano.created_at)} · barra de {resultado.comprimentoBarraMm}mm
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Barras necessárias</p>
          <p className="font-heading text-xl font-bold text-primary">{resultado.totalBarras}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Cortes</p>
          <p className="font-heading text-xl font-bold text-primary">{resultado.totalCortes}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Aproveitamento médio</p>
          <p className="font-heading text-xl font-bold text-primary">{resultado.aproveitamentoMedioPercentual}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Comprimento total (barras)</p>
          <p className="font-heading text-xl font-bold text-primary">{(resultado.comprimentoTotalBarrasMm / 1000).toFixed(1)} m</p>
        </div>
      </div>

      {resultado.pecasQueNaoCoube.length > 0 && (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-foreground">
          ⚠️ Peças maiores que a barra (não entraram no plano): {resultado.pecasQueNaoCoube.join(", ")}
        </div>
      )}

      <div className="space-y-4">
        {resultado.barras.map((barra) => (
          <div key={barra.numero} className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-sm font-semibold text-primary">Barra {barra.numero}</h2>
              <span className="text-xs text-muted">{barra.cortes.length} corte(s) · sobra {barra.sobraMm}mm · {barra.aproveitamentoPercentual}%</span>
            </div>
            <BarraDesenho barra={barra} comprimentoBarraMm={resultado.comprimentoBarraMm} />
          </div>
        ))}
      </div>
    </div>
  );
}
