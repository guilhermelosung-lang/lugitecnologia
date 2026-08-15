"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { marcarItemRecebidoAction } from "@/lib/actions/pedidos-tempera";
import type { Tables } from "@/types/database.types";

export function ItemRecebimento({
  item,
  pedidoId,
  podeConferir,
}: {
  item: Tables<"pedidos_tempera_itens">;
  pedidoId: string;
  podeConferir: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function alternar() {
    startTransition(async () => {
      await marcarItemRecebidoAction(item.id, pedidoId, !item.recebido);
      router.refresh();
    });
  }

  return (
    <tr className={`border-b border-border last:border-0 ${item.recebido ? "bg-success/5" : ""}`}>
      <td className="px-4 py-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={item.recebido} disabled={!podeConferir || pending} onChange={alternar} className="h-4 w-4" />
        </label>
      </td>
      <td className="px-4 py-2 font-medium text-foreground">{item.codigo}</td>
      <td className="px-4 py-2 text-muted">{item.descricao}</td>
      <td className="px-4 py-2 text-muted">{item.largura_mm} × {item.altura_mm} mm</td>
      <td className="px-4 py-2 text-muted">{item.espessura_mm} mm</td>
      <td className="px-4 py-2 text-muted">{item.quantidade}</td>
      <td className="px-4 py-2 text-muted">
        {item.recebido_em ? new Date(item.recebido_em).toLocaleDateString("pt-BR") : "—"}
      </td>
    </tr>
  );
}
