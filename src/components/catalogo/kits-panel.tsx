"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { criarKitAction, excluirKitAction } from "@/lib/actions/catalogo";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function KitsPanel({ sistemaId, kits }: { sistemaId: string; kits: Tables<"kits">[] }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await criarKitAction(sistemaId, formData);
      router.refresh();
    });
  }

  function handleDelete(kitId: string) {
    if (!confirm("Remover este kit?")) return;
    startTransition(async () => {
      await excluirKitAction(kitId, sistemaId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Kits deste sistema</h2>

      <ul className="mb-5 space-y-2">
        {kits.map((k) => (
          <li key={k.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            <Link href={`/catalogo/kits/${k.id}`} className="font-medium text-primary hover:text-accent-dark">
              {k.nome}
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => handleDelete(k.id)}
              className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
            >
              Remover
            </button>
          </li>
        ))}
        {kits.length === 0 && <li className="text-sm text-muted">Nenhum kit cadastrado ainda.</li>}
      </ul>

      <form action={handleCreate} className="grid gap-3 md:grid-cols-3 md:items-end">
        <div className="md:col-span-1">
          <Label htmlFor="nome">Nome do kit</Label>
          <Input id="nome" name="nome" required className="mt-1.5" />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="descricao">Descrição</Label>
          <Input id="descricao" name="descricao" className="mt-1.5" />
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar kit"}
        </Button>
      </form>
    </div>
  );
}
