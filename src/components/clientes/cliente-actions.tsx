"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { excluirClienteAction, restaurarClienteAction } from "@/lib/actions/clientes";
import { Button } from "@/components/ui/button";

export function ClienteActions({
  clienteId,
  excluido,
}: {
  clienteId: string;
  excluido: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (excluido) {
    return (
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await restaurarClienteAction(clienteId);
            router.refresh();
          })
        }
      >
        {pending ? "Restaurando..." : "Restaurar cliente"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir este cliente? Ele será marcado como inativo e removido das listagens.")) return;
        startTransition(async () => {
          await excluirClienteAction(clienteId);
          router.refresh();
        });
      }}
    >
      {pending ? "Excluindo..." : "Excluir cliente"}
    </Button>
  );
}
