import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { SacadaResultado } from "@/components/calculadoras/sacada-resultado";
import { SacadaLResultado } from "@/components/calculadoras/sacada-l-resultado";
import { SacadaUResultado } from "@/components/calculadoras/sacada-u-resultado";
import type { ResultadoSacadaReta } from "@/lib/calc/sacada";
import type { ResultadoSacadaL } from "@/lib/calc/sacada-l";
import type { ResultadoSacadaU } from "@/lib/calc/sacada-u";
import { formatDateTime } from "@/lib/utils";

const NOME_FORMATO: Record<string, string> = {
  reta: "Sacada reta",
  l: "Cortina de vidro em L",
  u: "Cortina de vidro em U",
};

export default async function CalculoSacadaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: calculo } = await supabase
    .from("calculos_sacada")
    .select("*, kits(nome), obras(nome)")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!calculo) notFound();

  const tipo = calculo.tipo_sacada as "reta" | "l" | "u";

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <p className="text-sm text-muted">
          {NOME_FORMATO[tipo] ?? "Sacada"} · {calculo.kits?.nome ?? "Sem kit (parâmetros padrão)"}
          {calculo.obras?.nome && (
            <>
              {" · "}
              <Link href={`/obras/${calculo.obra_id}`} className="text-accent-dark hover:underline">
                {calculo.obras.nome}
              </Link>
            </>
          )}
        </p>
        <h1 className="font-heading text-2xl font-bold text-primary">
          {calculo.nome || "Cálculo de sacada"}
        </h1>
        <p className="text-sm text-muted">Calculado em {formatDateTime(calculo.created_at)}</p>
      </div>

      {tipo === "l" && <SacadaLResultado resultado={calculo.resultado as unknown as ResultadoSacadaL} />}
      {tipo === "u" && <SacadaUResultado resultado={calculo.resultado as unknown as ResultadoSacadaU} />}
      {tipo === "reta" && <SacadaResultado resultado={calculo.resultado as unknown as ResultadoSacadaReta} />}
    </div>
  );
}
