"use client";

import { useActionState } from "react";
import { criarLancamentoAction } from "@/lib/actions/financeiro";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FornecedorOption = { id: string; nome: string };
type ObraOption = { id: string; nome: string };

export function NovoLancamentoForm({
  fornecedores,
  obras,
}: {
  fornecedores: FornecedorOption[];
  obras: ObraOption[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(criarLancamentoAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="tipo">Tipo *</Label>
          <Select id="tipo" name="tipo" defaultValue="receber" className="mt-1.5">
            <option value="receber">A receber</option>
            <option value="pagar">A pagar</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="categoria">Categoria *</Label>
          <Select id="categoria" name="categoria" defaultValue="outro" className="mt-1.5">
            <option value="fornecedor">Fornecedor</option>
            <option value="despesa_fixa">Despesa fixa</option>
            <option value="salario">Salário</option>
            <option value="frete">Frete</option>
            <option value="outro">Outro</option>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="descricao">Descrição *</Label>
          <Input id="descricao" name="descricao" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="valor">Valor (R$) *</Label>
          <Input id="valor" name="valor" type="number" step="0.01" min={0.01} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="data_vencimento">Vencimento *</Label>
          <Input id="data_vencimento" name="data_vencimento" type="date" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="fornecedor_id">Fornecedor (opcional)</Label>
          <Select id="fornecedor_id" name="fornecedor_id" defaultValue="" className="mt-1.5">
            <option value="">Nenhum</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </Select>
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
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={2} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Adicionar lançamento"}
      </Button>
    </form>
  );
}
