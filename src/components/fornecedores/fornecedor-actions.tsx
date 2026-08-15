"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { excluirFornecedorAction, restaurarFornecedorAction } from "@/lib/actions/fornecedores";
import { Button } from "@/components/ui/button";

export function FornecedorActions({ fornecedorId, excluido }: { fornecedorId: string; excluido: boolean }) {
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
            await restaurarFornecedorAction(fornecedorId);
            router.refresh();
          })
        }
      >
        {pending ? "Restaurando..." : "Restaurar fornecedor"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir este fornecedor? Ele será marcado como inativo.")) return;
        startTransition(async () => {
          await excluirFornecedorAction(fornecedorId);
          router.refresh();
        });
      }}
    >
      {pending ? "Excluindo..." : "Excluir fornecedor"}
    </Button>
  );
}
