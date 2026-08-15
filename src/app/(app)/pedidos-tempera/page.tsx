import Link from "next/link";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { NovoPedidoForm } from "@/components/pedidos-tempera/novo-pedido-form";
import { formatDateTime } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  em_producao: "Em produção",
  recebido_parcial: "Recebido parcialmente",
  recebido: "Recebido",
  cancelado: "Cancelado",
};

export default async function PedidosTemperaPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const [{ data: pedidos }, { data: obras }, { data: fornecedores }] = await Promise.all([
    supabase
      .from("pedidos_tempera")
      .select("*, obras(nome), fornecedores(nome), pedidos_tempera_itens(id, recebido)")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .order("numero", { ascending: false }),
    supabase.from("obras").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
    supabase.from("fornecedores").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
  ]);

  const podeGerenciar = hasPermissao(context, "pedido_tempera.gerar");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Pedidos para Têmpera</h1>
        <p className="text-sm text-muted">{pedidos?.length ?? 0} pedido(s)</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Obra</th>
              <th className="px-4 py-3">Fornecedor</th>
              <th className="px-4 py-3">Peças</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {(pedidos ?? []).map((p) => {
              const total = p.pedidos_tempera_itens?.length ?? 0;
              const recebidos = p.pedidos_tempera_itens?.filter((i) => i.recebido).length ?? 0;
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3">
                    <Link href={`/pedidos-tempera/${p.id}`} className="font-medium text-primary hover:text-accent-dark">
                      Pedido #{p.numero}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.obras?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{p.fornecedores?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{recebidos}/{total}</td>
                  <td className="px-4 py-3 text-muted">{STATUS_LABEL[p.status] ?? p.status}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(p.created_at)}</td>
                </tr>
              );
            })}
            {(!pedidos || pedidos.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">Nenhum pedido de têmpera ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {podeGerenciar && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Novo pedido</h2>
          <NovoPedidoForm obras={obras ?? []} fornecedores={fornecedores ?? []} />
        </div>
      )}
    </div>
  );
}
