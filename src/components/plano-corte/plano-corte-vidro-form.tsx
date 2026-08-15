"use client";

import { useActionState } from "react";
import { calcularESalvarPlanoCorteVidroAction } from "@/lib/actions/plano-corte";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };

export function PlanoCorteVidroForm({ obras }: { obras: ObraOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(calcularESalvarPlanoCorteVidroAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nome">Identificação (opcional)</Label>
          <Input id="nome" name="nome" placeholder="ex: Plano de corte obra X" className="mt-1.5" />
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
          <Label htmlFor="chapa_largura_mm">Largura da chapa (mm) *</Label>
          <Input id="chapa_largura_mm" name="chapa_largura_mm" type="number" step="1" min={1} defaultValue={2250} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="chapa_altura_mm">Altura da chapa (mm) *</Label>
          <Input id="chapa_altura_mm" name="chapa_altura_mm" type="number" step="1" min={1} defaultValue={3210} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="margem_mm">Margem entre peças (mm)</Label>
          <Input id="margem_mm" name="margem_mm" type="number" step="1" min={0} defaultValue={5} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="pecas_texto">Peças (uma por linha: código;largura;altura;quantidade)</Label>
        <Textarea
          id="pecas_texto"
          name="pecas_texto"
          rows={8}
          required
          placeholder={"V1;500;1900;4\nV2;700;1200;3"}
          className="mt-1.5 font-mono text-xs"
        />
        <p className="mt-1 text-xs text-muted">Cole ou digite uma peça por linha. Largura e altura em milímetros.</p>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Gerar plano de corte"}
      </Button>
    </form>
  );
}
