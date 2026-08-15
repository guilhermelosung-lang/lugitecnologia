import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ItemRecebimento } from "@/components/pedidos-tempera/item-recebimento";
import { StatusPedidoSelect } from "@/components/pedidos-tempera/status-pedido-select";
import { formatDateTime } from "@/lib/utils";

export default async function PedidoTemperaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from("pedidos_tempera")
    .select("*, obras(id, nome), fornecedores(nome)")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!pedido) notFound();

  const { data: itens } = await supabase
    .from("pedidos_tempera_itens")
    .select("*")
    .eq("pedido_id", id)
    .order("codigo");

  const podeGerenciar = hasPermissao(context, "pedido_tempera.gerar");
  const totalM2 = (itens ?? []).reduce((acc, i) => acc + (i.largura_mm / 1000) * (i.altura_mm / 1000) * i.quantidade, 0);
  const recebidos = (itens ?? []).filter((i) => i.recebido).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            <Link href={`/obras/${pedido.obra_id}`} className="text-accent-dark hover:underline">
              {pedido.obras?.nome}
            </Link>
            {pedido.fornecedores?.nome ? ` · ${pedido.fornecedores.nome}` : ""}
          </p>
          <h1 className="font-heading text-2xl font-bold text-primary">Pedido de Têmpera #{pedido.numero}</h1>
          <p className="text-sm text-muted">
            Criado em {formatDateTime(pedido.created_at)} · {recebidos}/{itens?.length ?? 0} peças recebidas ·{" "}
            {totalM2.toFixed(2)} m² no total
          </p>
        </div>
        <StatusPedidoSelect pedidoId={pedido.id} status={pedido.status} podeGerenciar={podeGerenciar} />
      </div>

      {pedido.observacoes && (
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-foreground">
          {pedido.observacoes}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Recebido</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Medida</th>
              <th className="px-4 py-3">Espessura</th>
              <th className="px-4 py-3">Qtd.</th>
              <th className="px-4 py-3">Recebido em</th>
            </tr>
          </thead>
          <tbody>
            {(itens ?? []).map((item) => (
              <ItemRecebimento key={item.id} item={item} pedidoId={pedido.id} podeConferir={podeGerenciar} />
            ))}
            {(!itens || itens.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">Nenhuma peça neste pedido.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
