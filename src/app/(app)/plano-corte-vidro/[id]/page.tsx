import { notFound } from "next/navigation";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ChapaDesenho } from "@/components/plano-corte/chapa-desenho";
import type { ResultadoPlanoCorteVidro } from "@/lib/calc/plano-corte-vidro";
import { formatDateTime } from "@/lib/utils";

export default async function PlanoCorteVidroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: plano } = await supabase
    .from("planos_corte_vidro")
    .select("*, obras(nome)")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!plano) notFound();

  const resultado = plano.resultado as unknown as ResultadoPlanoCorteVidro;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-sm text-muted">{plano.obras?.nome ?? "Sem obra"}</p>
        <h1 className="font-heading text-2xl font-bold text-primary">{plano.nome || "Plano de corte de vidro"}</h1>
        <p className="text-sm text-muted">
          Calculado em {formatDateTime(plano.created_at)} · chapa {resultado.chapaLarguraMm}×{resultado.chapaAlturaMm}mm
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Chapas necessárias</p>
          <p className="font-heading text-xl font-bold text-primary">{resultado.totalChapas}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Peças</p>
          <p className="font-heading text-xl font-bold text-primary">{resultado.totalPecas}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Aproveitamento médio</p>
          <p className="font-heading text-xl font-bold text-primary">{resultado.aproveitamentoMedioPercentual}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Área total (chapas)</p>
          <p className="font-heading text-xl font-bold text-primary">{resultado.areaTotalChapasM2} m²</p>
        </div>
      </div>

      {resultado.pecasQueNaoCoube.length > 0 && (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-foreground">
          ⚠️ Peças maiores que a chapa (não entraram no plano): {resultado.pecasQueNaoCoube.join(", ")}
        </div>
      )}

      <div className="space-y-6">
        {resultado.chapas.map((chapa) => (
          <div key={chapa.numero} className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-sm font-semibold text-primary">Chapa {chapa.numero}</h2>
              <span className="text-xs text-muted">{chapa.pecas.length} peça(s) · {chapa.aproveitamentoPercentual}% aproveitada</span>
            </div>
            <ChapaDesenho chapa={chapa} chapaLarguraMm={resultado.chapaLarguraMm} chapaAlturaMm={resultado.chapaAlturaMm} />
          </div>
        ))}
      </div>
    </div>
  );
}
