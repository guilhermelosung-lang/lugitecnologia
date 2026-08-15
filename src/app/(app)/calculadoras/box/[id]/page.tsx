import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { BoxResultado } from "@/components/calculadoras/box-resultado";
import type { ResultadoBoxFrontalCorrer } from "@/lib/calc/box";
import { formatDateTime } from "@/lib/utils";

export default async function CalculoBoxDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: calculo } = await supabase
    .from("calculos_box")
    .select("*, kits(nome), obras(nome)")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!calculo) notFound();

  const resultado = calculo.resultado as unknown as ResultadoBoxFrontalCorrer;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-muted">
          {calculo.kits?.nome ?? "Sem kit (parâmetros padrão)"}
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
          {calculo.nome || "Cálculo de box"}
        </h1>
        <p className="text-sm text-muted">Calculado em {formatDateTime(calculo.created_at)}</p>
      </div>

      <BoxResultado resultado={resultado} />
    </div>
  );
}
