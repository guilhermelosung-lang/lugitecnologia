"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { criarMedicaoAction, excluirMedicaoAction } from "@/lib/actions/medicoes";
import { verificarEsquadro } from "@/lib/calc/esquadro";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

const TIPO_LABEL: Record<string, string> = {
  vao: "Vão",
  diagonal: "Diagonal (esquadro)",
  nivel: "Nível",
  prumo: "Prumo",
  outro: "Outro",
};

export function MedicoesPanel({
  ambienteId,
  obraId,
  medicoes,
}: {
  ambienteId: string;
  obraId: string;
  medicoes: Tables<"medicoes">[];
}) {
  const [aberto, setAberto] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await criarMedicaoAction(ambienteId, obraId, formData);
      router.refresh();
    });
  }

  function handleDelete(medicaoId: string) {
    startTransition(async () => {
      await excluirMedicaoAction(medicaoId, obraId);
      router.refresh();
    });
  }

  return (
    <div className="mt-2 rounded-lg bg-background/60 p-3">
      <button type="button" onClick={() => setAberto((v) => !v)} className="text-xs font-medium text-accent-dark hover:underline">
        {aberto ? "Ocultar medições" : `Medições (${medicoes.length})`}
      </button>

      {aberto && (
        <div className="mt-3 space-y-3">
          <ul className="space-y-2">
            {medicoes.map((m) => {
              const esquadro =
                m.tipo_medida === "diagonal" && m.diagonal1_mm && m.diagonal2_mm
                  ? verificarEsquadro(m.diagonal1_mm, m.diagonal2_mm)
                  : null;
              return (
                <li key={m.id} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs">
                  <div>
                    <p className="font-medium text-foreground">
                      {TIPO_LABEL[m.tipo_medida]}
                      {m.largura_mm && m.altura_mm ? ` — ${m.largura_mm} × ${m.altura_mm} mm` : ""}
                      {m.diagonal1_mm && m.diagonal2_mm ? ` — diagonais ${m.diagonal1_mm} / ${m.diagonal2_mm} mm` : ""}
                    </p>
                    {esquadro && (
                      <p className={esquadro.dentroTolerancia ? "text-success" : "text-danger"}>{esquadro.mensagem}</p>
                    )}
                    {m.observacoes && <p className="text-muted">{m.observacoes}</p>}
                    <p className="text-muted">{formatDateTime(m.created_at)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => handleDelete(m.id)}
                    className="shrink-0 font-medium text-danger hover:underline disabled:opacity-60"
                  >
                    Remover
                  </button>
                </li>
              );
            })}
            {medicoes.length === 0 && <li className="text-xs text-muted">Nenhuma medição registrada ainda.</li>}
          </ul>

          <form action={handleCreate} className="grid grid-cols-2 gap-2 md:grid-cols-6 md:items-end">
            <div>
              <Label htmlFor={`tipo_medida_${ambienteId}`}>Tipo</Label>
              <Select id={`tipo_medida_${ambienteId}`} name="tipo_medida" defaultValue="vao" className="mt-1 text-xs">
                <option value="vao">Vão</option>
                <option value="diagonal">Diagonal</option>
                <option value="nivel">Nível</option>
                <option value="prumo">Prumo</option>
                <option value="outro">Outro</option>
              </Select>
            </div>
            <div>
              <Label htmlFor={`largura_mm_${ambienteId}`}>Largura</Label>
              <Input id={`largura_mm_${ambienteId}`} name="largura_mm" type="number" step="1" className="mt-1 text-xs" />
            </div>
            <div>
              <Label htmlFor={`altura_mm_${ambienteId}`}>Altura</Label>
              <Input id={`altura_mm_${ambienteId}`} name="altura_mm" type="number" step="1" className="mt-1 text-xs" />
            </div>
            <div>
              <Label htmlFor={`diagonal1_mm_${ambienteId}`}>Diagonal 1</Label>
              <Input id={`diagonal1_mm_${ambienteId}`} name="diagonal1_mm" type="number" step="1" className="mt-1 text-xs" />
            </div>
            <div>
              <Label htmlFor={`diagonal2_mm_${ambienteId}`}>Diagonal 2</Label>
              <Input id={`diagonal2_mm_${ambienteId}`} name="diagonal2_mm" type="number" step="1" className="mt-1 text-xs" />
            </div>
            <Button type="submit" variant="secondary" className="px-3 py-1.5 text-xs" disabled={pending}>
              {pending ? "Salvando..." : "Registrar"}
            </Button>
            <div className="col-span-2 md:col-span-6">
              <Label htmlFor={`observacoes_${ambienteId}`}>Observações</Label>
              <Input id={`observacoes_${ambienteId}`} name="observacoes" className="mt-1 text-xs" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
