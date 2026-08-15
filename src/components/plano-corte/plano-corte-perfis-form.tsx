"use client";

import { useActionState } from "react";
import { calcularESalvarPlanoCortePerfisAction } from "@/lib/actions/plano-corte";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };

export function PlanoCortePerfisForm({ obras }: { obras: ObraOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(calcularESalvarPlanoCortePerfisAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nome">Identificação (opcional)</Label>
          <Input id="nome" name="nome" placeholder="ex: Perfis obra X" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="obra_id">Obra (opcional)</Label>
          <Select id="obra_id" name="obra_id" defaultValue="" className="mt-1.5">
            <option value="">Nenhuma</option>
            {obras.map((o) => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="comprimento_barra_mm">Comprimento da barra (mm) *</Label>
          <Input id="comprimento_barra_mm" name="comprimento_barra_mm" type="number" step="1" min={1} defaultValue={6000} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="margem_mm">Margem de serra entre cortes (mm)</Label>
          <Input id="margem_mm" name="margem_mm" type="number" step="1" min={0} defaultValue={3} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="pecas_texto">Peças (uma por linha: código;comprimento;quantidade)</Label>
        <Textarea
          id="pecas_texto"
          name="pecas_texto"
          rows={8}
          required
          placeholder={"P1;1200;5\nP2;800;4"}
          className="mt-1.5 font-mono text-xs"
        />
        <p className="mt-1 text-xs text-muted">Cole ou digite uma peça por linha. Comprimento em milímetros.</p>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Gerar plano de corte"}
      </Button>
    </form>
  );
}
