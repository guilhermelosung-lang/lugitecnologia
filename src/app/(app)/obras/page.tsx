import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { OBRA_STATUS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

const STATUS_LABEL = Object.fromEntries(OBRA_STATUS.map((s) => [s.value, s.label]));

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const context = await requireUsuario();
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("obras")
    .select("*, clientes(nome)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (q) query = query.ilike("nome", `%${q}%`);

  const { data: obras, error } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Obras</h1>
          <p className="text-sm text-muted">{obras?.length ?? 0} obra(s) encontrada(s)</p>
        </div>
        <Link href="/obras/novo">
          <Button>Nova obra</Button>
        </Link>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Input name="q" defaultValue={q} placeholder="Buscar por nome da obra" className="max-w-sm" />
        <Select name="status" defaultValue={status ?? ""} className="max-w-xs">
          <option value="">Todos os status</option>
          {OBRA_STATUS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      {error && <p className="text-sm text-danger">{error.message}</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Obra</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data prevista</th>
              <th className="px-4 py-3">Criada em</th>
            </tr>
          </thead>
          <tbody>
            {(obras ?? []).map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3">
                  <Link href={`/obras/${o.id}`} className="font-medium text-primary hover:text-accent-dark">
                    {o.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{o.clientes?.nome ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-dark">
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{o.data_prevista ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(o.created_at)}</td>
              </tr>
            ))}
            {(!obras || obras.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Nenhuma obra encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
