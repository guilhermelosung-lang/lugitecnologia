import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ORCAMENTO_STATUS } from "@/lib/constants";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STATUS_LABEL = Object.fromEntries(ORCAMENTO_STATUS.map((s) => [s.value, s.label]));

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const context = await requireUsuario();
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orcamentos")
    .select("*, obras(nome, clientes(nome))")
    .eq("empresa_id", context.empresa.id)
    .order("numero", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: orcamentos } = await query;

  const ids = (orcamentos ?? []).map((o) => o.id);
  const { data: todosItens } = ids.length
    ? await supabase.from("orcamento_itens").select("orcamento_id, quantidade, preco_unitario").in("orcamento_id", ids)
    : { data: [] };

  const totalPorOrcamento = new Map<string, number>();
  for (const item of todosItens ?? []) {
    totalPorOrcamento.set(
      item.orcamento_id,
      (totalPorOrcamento.get(item.orcamento_id) ?? 0) + item.quantidade * item.preco_unitario
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Orçamentos</h1>
          <p className="text-sm text-muted">{orcamentos?.length ?? 0} orçamento(s)</p>
        </div>
        <Link href="/obras">
          <Button variant="secondary">Ir para uma obra para criar</Button>
        </Link>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="status" defaultValue={status ?? ""} className="max-w-xs">
          <option value="">Todos os status</option>
          {ORCAMENTO_STATUS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Nº</th>
              <th className="px-4 py-3">Obra / Cliente</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Validade</th>
            </tr>
          </thead>
          <tbody>
            {(orcamentos ?? []).map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3">
                  <Link href={`/orcamentos/${o.id}`} className="font-medium text-primary hover:text-accent-dark">
                    #{o.numero}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {o.obras?.nome} {o.obras?.clientes?.nome ? `· ${o.obras.clientes.nome}` : ""}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-dark">
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  R$ {(totalPorOrcamento.get(o.id) ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-muted">{o.data_validade ?? "—"}</td>
              </tr>
            ))}
            {(!orcamentos || orcamentos.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Nenhum orçamento ainda. Crie um a partir de uma obra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
