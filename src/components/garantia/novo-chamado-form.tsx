"use client";

import { useActionState } from "react";
import { criarChamadoAction } from "@/lib/actions/garantia";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };

export function NovoChamadoForm({ obras }: { obras: ObraOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(criarChamadoAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="obra_id">Obra *</Label>
          <Select id="obra_id" name="obra_id" required className="mt-1.5">
            <option value="">Selecione</option>
            {obras.map((o) => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="tipo">Tipo *</Label>
          <Select id="tipo" name="tipo" defaultValue="garantia" className="mt-1.5">
            <option value="garantia">Garantia</option>
            <option value="assistencia">Assistência técnica</option>
            <option value="reclamacao">Reclamação</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="prioridade">Prioridade *</Label>
          <Select id="prioridade" name="prioridade" defaultValue="media" className="mt-1.5">
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="titulo">Título *</Label>
          <Input id="titulo" name="titulo" required className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="descricao">Descrição do problema *</Label>
          <Textarea id="descricao" name="descricao" rows={3} required className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Abrindo..." : "Abrir chamado"}
      </Button>
    </form>
  );
}
