import { notFound } from "next/navigation";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import type { ResultadoPesoVidro } from "@/lib/calc/peso-vidro";
import { formatDateTime } from "@/lib/utils";

const TIPO_LABEL: Record<string, string> = {
  porta_janela: "Porta/Janela",
  guarda_corpo: "Guarda-corpo",
  piso: "Piso",
  cobertura: "Cobertura",
  outro: "Outro",
};

export default async function PesoVidroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: calculo } = await supabase
    .from("calculos_peso_vidro")
    .select("*, obras(nome)")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!calculo) notFound();

  const resultado = calculo.resultado as unknown as ResultadoPesoVidro;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted">{calculo.obras?.nome ?? "Sem obra"} · {TIPO_LABEL[calculo.tipo_instalacao]}</p>
        <h1 className="font-heading text-2xl font-bold text-primary">{calculo.nome || "Cálculo de peso"}</h1>
        <p className="text-sm text-muted">Calculado em {formatDateTime(calculo.created_at)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Medida</p>
          <p className="font-heading text-lg font-bold text-primary">{calculo.largura_mm} × {calculo.altura_mm} mm</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Área</p>
          <p className="font-heading text-lg font-bold text-primary">{resultado.areaM2} m²</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Peso total</p>
          <p className="font-heading text-lg font-bold text-primary">{resultado.pesoKg} kg</p>
        </div>
      </div>

      {resultado.alertaPeso && (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
          ⚠️ {resultado.alertaPeso}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-2 font-heading text-sm font-semibold text-primary">Recomendação de transporte</h2>
        <p className="text-sm text-foreground">{resultado.recomendacaoTransporte}</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Como esse cálculo foi feito</h2>
        <ol className="space-y-2 text-sm text-foreground">
          {resultado.passos.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-semibold text-accent-dark">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
