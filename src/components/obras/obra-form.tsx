"use client";

import { useActionState } from "react";
import { criarObraAction, atualizarObraAction } from "@/lib/actions/obras";
import { OBRA_STATUS } from "@/lib/constants";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ObraForm({
  obra,
  clientes,
  clienteIdInicial,
}: {
  obra?: Tables<"obras">;
  clientes: Pick<Tables<"clientes">, "id" | "nome">[];
  clienteIdInicial?: string;
}) {
  const action = obra ? atualizarObraAction.bind(null, obra.id) : criarObraAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="cliente_id">Cliente *</Label>
          <Select
            id="cliente_id"
            name="cliente_id"
            required
            defaultValue={obra?.cliente_id ?? clienteIdInicial ?? ""}
            className="mt-1.5"
          >
            <option value="">Selecione</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="nome">Nome da obra *</Label>
          <Input id="nome" name="nome" defaultValue={obra?.nome} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={obra?.status ?? "lead"} className="mt-1.5">
            {OBRA_STATUS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" name="endereco" defaultValue={obra?.endereco ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="condominio">Condomínio</Label>
          <Input id="condominio" name="condominio" defaultValue={obra?.condominio ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="bloco">Bloco</Label>
          <Input id="bloco" name="bloco" defaultValue={obra?.bloco ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="apartamento">Apartamento</Label>
          <Input id="apartamento" name="apartamento" defaultValue={obra?.apartamento ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="andar">Andar</Label>
          <Input id="andar" name="andar" defaultValue={obra?.andar ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="responsavel_local">Responsável no local</Label>
          <Input id="responsavel_local" name="responsavel_local" defaultValue={obra?.responsavel_local ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="telefone_local">Telefone do local</Label>
          <Input id="telefone_local" name="telefone_local" defaultValue={obra?.telefone_local ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="data_visita">Data da visita</Label>
          <Input id="data_visita" name="data_visita" type="date" defaultValue={obra?.data_visita ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="data_prevista">Data prevista</Label>
          <Input id="data_prevista" name="data_prevista" type="date" defaultValue={obra?.data_prevista ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="situacao_acesso">Situação de acesso</Label>
          <Input id="situacao_acesso" name="situacao_acesso" defaultValue={obra?.situacao_acesso ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="estacionamento">Estacionamento</Label>
          <Input id="estacionamento" name="estacionamento" defaultValue={obra?.estacionamento ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="restricoes_horario">Restrições de horário</Label>
          <Input id="restricoes_horario" name="restricoes_horario" defaultValue={obra?.restricoes_horario ?? ""} className="mt-1.5" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="necessita_andaime" name="necessita_andaime" defaultChecked={obra?.necessita_andaime} className="h-4 w-4" />
          <Label htmlFor="necessita_andaime">Necessita andaime</Label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="necessita_icamento" name="necessita_icamento" defaultChecked={obra?.necessita_icamento} className="h-4 w-4" />
          <Label htmlFor="necessita_icamento">Necessita içamento</Label>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={obra?.observacoes ?? ""} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : obra ? "Salvar alterações" : "Criar obra"}
      </Button>
    </form>
  );
}
