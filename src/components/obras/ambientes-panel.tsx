"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { criarAmbienteAction, excluirAmbienteAction } from "@/lib/actions/obras";
import { AMBIENTE_TIPOS } from "@/lib/constants";
import { MedicoesPanel } from "@/components/obras/medicoes-panel";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIPO_LABEL = Object.fromEntries(AMBIENTE_TIPOS.map((t) => [t.value, t.label]));

export function AmbientesPanel({
  obraId,
  ambientes,
  medicoesPorAmbiente,
}: {
  obraId: string;
  ambientes: Tables<"ambientes">[];
  medicoesPorAmbiente: Record<string, Tables<"medicoes">[]>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await criarAmbienteAction(obraId, formData);
      router.refresh();
    });
  }

  function handleDelete(ambienteId: string) {
    startTransition(async () => {
      await excluirAmbienteAction(ambienteId, obraId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Ambientes</h2>

      <ul className="mb-5 space-y-2">
        {ambientes.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            <div>
              <span className="font-medium text-foreground">
                {a.tipo === "personalizado" ? a.nome_personalizado || "Personalizado" : TIPO_LABEL[a.tipo]}
              </span>
              {a.observacoes && <span className="ml-2 text-muted">— {a.observacoes}</span>}
              <MedicoesPanel ambienteId={a.id} obraId={obraId} medicoes={medicoesPorAmbiente[a.id] ?? []} />
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => handleDelete(a.id)}
              className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
            >
              Remover
            </button>
          </li>
        ))}
        {ambientes.length === 0 && <li className="text-sm text-muted">Nenhum ambiente cadastrado ainda.</li>}
      </ul>

      <form action={handleCreate} className="grid gap-3 md:grid-cols-4 md:items-end">
        <div className="md:col-span-1">
          <Label htmlFor="tipo">Tipo</Label>
          <Select id="tipo" name="tipo" required className="mt-1.5">
            {AMBIENTE_TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="nome_personalizado">Nome (se personalizado)</Label>
          <Input id="nome_personalizado" name="nome_personalizado" className="mt-1.5" />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="observacoes">Observações</Label>
          <Input id="observacoes" name="observacoes" className="mt-1.5" />
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar ambiente"}
        </Button>
      </form>
    </div>
  );
}
