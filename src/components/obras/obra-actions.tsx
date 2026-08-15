"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { excluirObraAction, restaurarObraAction } from "@/lib/actions/obras";
import { Button } from "@/components/ui/button";

export function ObraActions({ obraId, excluida }: { obraId: string; excluida: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (excluida) {
    return (
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await restaurarObraAction(obraId);
            router.refresh();
          })
        }
      >
        {pending ? "Restaurando..." : "Restaurar obra"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir esta obra?")) return;
        startTransition(async () => {
          await excluirObraAction(obraId);
          router.refresh();
        });
      }}
    >
      {pending ? "Excluindo..." : "Excluir obra"}
    </Button>
  );
}
