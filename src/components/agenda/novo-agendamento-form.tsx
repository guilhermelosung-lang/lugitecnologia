"use client";

import { useActionState } from "react";
import { criarAgendamentoAction } from "@/lib/actions/agenda";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };
type UsuarioOption = { id: string; nome: string };

export function NovoAgendamentoForm({ obras, usuarios }: { obras: ObraOption[]; usuarios: UsuarioOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(criarAgendamentoAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
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
          <Select id="tipo" name="tipo" defaultValue="instalacao" className="mt-1.5">
            <option value="medicao">Medição</option>
            <option value="instalacao">Instalação</option>
            <option value="visita_tecnica">Visita técnica</option>
            <option value="manutencao">Manutenção</option>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="titulo">Título *</Label>
          <Input id="titulo" name="titulo" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="data_hora_inicio">Início *</Label>
          <Input id="data_hora_inicio" name="data_hora_inicio" type="datetime-local" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="data_hora_fim">Fim (opcional)</Label>
          <Input id="data_hora_fim" name="data_hora_fim" type="datetime-local" className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="responsavel_id">Responsável (opcional)</Label>
          <Select id="responsavel_id" name="responsavel_id" defaultValue="" className="mt-1.5">
            <option value="">Nenhum</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nome}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={2} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Agendando..." : "Agendar"}
      </Button>
    </form>
  );
}
