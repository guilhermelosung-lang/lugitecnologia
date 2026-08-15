"use client";

import { useActionState, useState } from "react";
import { calcularESalvarJanelaAction } from "@/lib/actions/calculo-janela";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type KitOption = { id: string; nome: string; sistemaNome: string };
type ObraOption = { id: string; nome: string };

export function JanelaForm({
  kits,
  obras,
  obraIdInicial,
}: {
  kits: KitOption[];
  obras: ObraOption[];
  obraIdInicial?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    calcularESalvarJanelaAction,
    undefined
  );
  const [tipo, setTipo] = useState<"fixa" | "correr">("fixa");

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="kit_id">Kit (opcional)</Label>
          <Select id="kit_id" name="kit_id" defaultValue="" className="mt-1.5">
            <option value="">Nenhum (usar parâmetros padrão)</option>
            {kits.map((k) => (
              <option key={k.id} value={k.id}>{k.sistemaNome} — {k.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="obra_id">Obra (opcional)</Label>
          <Select id="obra_id" name="obra_id" defaultValue={obraIdInicial ?? ""} className="mt-1.5">
            <option value="">Nenhuma</option>
            {obras.map((o) => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="tipo_janela">Tipo de janela *</Label>
          <Select
            id="tipo_janela"
            name="tipo_janela"
            required
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "fixa" | "correr")}
            className="mt-1.5"
          >
            <option value="fixa">Fixa (painel único)</option>
            <option value="correr">De correr (2 folhas)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="nome">Identificação (opcional)</Label>
          <Input id="nome" name="nome" placeholder="ex: Janela do quarto" className="mt-1.5" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Medidas do vão (mm)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="largura_vao_mm">Largura do vão</Label>
            <Input id="largura_vao_mm" name="largura_vao_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="altura_vao_mm">Altura do vão</Label>
            <Input id="altura_vao_mm" name="altura_vao_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="espessura_mm">Espessura do vidro (mm)</Label>
        <Select id="espessura_mm" name="espessura_mm" defaultValue="6" className="mt-1.5 max-w-xs">
          {[4, 6, 8, 10].map((v) => (
            <option key={v} value={v}>{v} mm</option>
          ))}
        </Select>
      </div>

      {tipo === "correr" && (
        <p className="text-xs text-muted">
          Consideramos 2 folhas (1 fixa + 1 móvel). Configurações com 3 ou mais folhas ainda não
          são suportadas.
        </p>
      )}

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Calcular janela"}
      </Button>
    </form>
  );
}
