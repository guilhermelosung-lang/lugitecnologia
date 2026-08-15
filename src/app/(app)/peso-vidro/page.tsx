import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export default async function PesoVidroPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: calculos } = await supabase
    .from("calculos_peso_vidro")
    .select("*, obras(nome)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Peso e Segurança do Vidro</h1>
          <p className="text-sm text-muted">{calculos?.length ?? 0} cálculo(s) salvo(s)</p>
        </div>
        <Link href="/peso-vidro/novo">
          <Button>Novo cálculo</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Identificação</th>
              <th className="px-4 py-3">Obra</th>
              <th className="px-4 py-3">Medida</th>
              <th className="px-4 py-3">Peso</th>
              <th className="px-4 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {(calculos ?? []).map((c) => {
              const resultado = c.resultado as { pesoKg?: number };
              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3">
                    <Link href={`/peso-vidro/${c.id}`} className="font-medium text-primary hover:text-accent-dark">
                      {c.nome || "Sem identificação"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.obras?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{c.largura_mm} × {c.altura_mm} mm ({c.espessura_mm}mm)</td>
                  <td className="px-4 py-3 text-muted">{resultado?.pesoKg ?? "—"} kg</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(c.created_at)}</td>
                </tr>
              );
            })}
            {(!calculos || calculos.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">Nenhum cálculo ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
