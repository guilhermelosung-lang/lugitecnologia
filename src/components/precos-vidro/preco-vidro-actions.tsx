"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { excluirPrecoVidroAction, restaurarPrecoVidroAction } from "@/lib/actions/precos-vidro";
import { Button } from "@/components/ui/button";

export function PrecoVidroActions({ precoId, excluido }: { precoId: string; excluido: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (excluido) {
    return (
      <Button
        type="button"
        variant="secondary"
        className="px-3 py-1.5 text-xs"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await restaurarPrecoVidroAction(precoId);
            router.refresh();
          })
        }
      >
        {pending ? "Restaurando..." : "Restaurar"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="danger"
      className="px-3 py-1.5 text-xs"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir este preço de vidro?")) return;
        startTransition(async () => {
          await excluirPrecoVidroAction(precoId);
          router.refresh();
        });
      }}
    >
      {pending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}
