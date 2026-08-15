"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusPedidoAction } from "@/lib/actions/pedidos-tempera";
import { Select } from "@/components/ui/input";

const OPCOES = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "em_producao", label: "Em produção" },
  { value: "recebido_parcial", label: "Recebido parcialmente" },
  { value: "recebido", label: "Recebido" },
  { value: "cancelado", label: "Cancelado" },
] as const;

export function StatusPedidoSelect({ pedidoId, status, podeGerenciar }: { pedidoId: string; status: string; podeGerenciar: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!podeGerenciar) {
    return <span className="text-sm font-medium text-foreground">{OPCOES.find((o) => o.value === status)?.label ?? status}</span>;
  }

  return (
    <Select
      defaultValue={status}
      disabled={pending}
      className="w-56"
      onChange={(e) => {
        const novoStatus = e.target.value as (typeof OPCOES)[number]["value"];
        startTransition(async () => {
          await atualizarStatusPedidoAction(pedidoId, novoStatus);
          router.refresh();
        });
      }}
    >
      {OPCOES.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </Select>
  );
}
