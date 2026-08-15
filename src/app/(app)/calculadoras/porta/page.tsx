import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

const TIPO_LABEL: Record<string, string> = {
  abrir: "De abrir",
  pivotante: "Pivotante",
  correr: "De correr",
  com_fixo: "Com fixo",
};

export default async function CalculosPortaPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: calculos } = await supabase
    .from("calculos_porta")
    .select("*, kits(nome), obras(nome)")
    .eq("empresa_id", context.empresa.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Calculadora de Porta de Vidro</h1>
          <p className="text-sm text-muted">{calculos?.length ?? 0} cálculo(s) salvo(s)</p>
        </div>
        <Link href="/calculadoras/porta/novo">
          <Button>Novo cálculo</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Identificação</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Kit</th>
              <th className="px-4 py-3">Obra</th>
              <th className="px-4 py-3">Peso</th>
              <th className="px-4 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {(calculos ?? []).map((c) => {
              const resultado = c.resultado as { pesoTotalKg?: number };
              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3">
                    <Link href={`/calculadoras/porta/${c.id}`} className="font-medium text-primary hover:text-accent-dark">
                      {c.nome || "Sem identificação"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{TIPO_LABEL[c.tipo_porta] ?? c.tipo_porta}</td>
                  <td className="px-4 py-3 text-muted">{c.kits?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{c.obras?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{resultado?.pesoTotalKg ?? "—"} kg</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(c.created_at)}</td>
                </tr>
              );
            })}
            {(!calculos || calculos.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  Nenhum cálculo de porta ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
