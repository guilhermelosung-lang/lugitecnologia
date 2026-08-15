"use client";

import { useActionState } from "react";
import { criarPedidoTemperaAction } from "@/lib/actions/pedidos-tempera";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };
type FornecedorOption = { id: string; nome: string };

export function NovoPedidoForm({ obras, fornecedores }: { obras: ObraOption[]; fornecedores: FornecedorOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(criarPedidoTemperaAction, undefined);

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
          <Label htmlFor="fornecedor_id">Fornecedor de têmpera (opcional)</Label>
          <Select id="fornecedor_id" name="fornecedor_id" defaultValue="" className="mt-1.5">
            <option value="">Nenhum</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={2} className="mt-1.5" />
        </div>
      </div>
      <p className="text-xs text-muted">
        Gera a lista de peças automaticamente a partir de todos os cálculos técnicos (box, sacada, porta,
        janela) já feitos para essa obra.
      </p>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Gerando..." : "Gerar pedido"}
      </Button>
    </form>
  );
}
