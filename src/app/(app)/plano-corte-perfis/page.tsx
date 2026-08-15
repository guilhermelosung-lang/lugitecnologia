import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { PlanoCortePerfisForm } from "@/components/plano-corte/plano-corte-perfis-form";
import { formatDateTime } from "@/lib/utils";

export default async function PlanoCortePerfisPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const [{ data: planos }, { data: obras }] = await Promise.all([
    supabase
      .from("planos_corte_perfis")
      .select("*, obras(nome)")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.from("obras").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Plano de Corte de Perfis</h1>
        <p className="text-sm text-muted">
          {planos?.length ?? 0} plano(s) · empacotamento de peças dentro de barras pra minimizar sobra
          (algoritmo first-fit-decreasing).
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Identificação</th>
              <th className="px-4 py-3">Obra</th>
              <th className="px-4 py-3">Barras</th>
              <th className="px-4 py-3">Aproveitamento</th>
              <th className="px-4 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {(planos ?? []).map((p) => {
              const resultado = p.resultado as { totalBarras?: number; aproveitamentoMedioPercentual?: number };
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3">
                    <Link href={`/plano-corte-perfis/${p.id}`} className="font-medium text-primary hover:text-accent-dark">
                      {p.nome || "Plano de corte"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.obras?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{resultado?.totalBarras ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{resultado?.aproveitamentoMedioPercentual ?? "—"}%</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(p.created_at)}</td>
                </tr>
              );
            })}
            {(!planos || planos.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">Nenhum plano de corte ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Novo plano de corte</h2>
        <PlanoCortePerfisForm obras={obras ?? []} />
      </div>
    </div>
  );
}
