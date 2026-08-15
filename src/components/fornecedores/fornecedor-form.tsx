"use client";

import { useActionState } from "react";
import { criarFornecedorAction, atualizarFornecedorAction } from "@/lib/actions/fornecedores";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FornecedorForm({ fornecedor }: { fornecedor?: Tables<"fornecedores"> }) {
  const action = fornecedor
    ? atualizarFornecedorAction.bind(null, fornecedor.id)
    : criarFornecedorAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="nome">Nome / Razão social *</Label>
          <Input id="nome" name="nome" defaultValue={fornecedor?.nome} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input id="cnpj" name="cnpj" defaultValue={fornecedor?.cnpj ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="contato">Contato</Label>
          <Input id="contato" name="contato" defaultValue={fornecedor?.contato ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" name="telefone" defaultValue={fornecedor?.telefone ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={fornecedor?.whatsapp ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={fornecedor?.email ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" name="endereco" defaultValue={fornecedor?.endereco ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" name="cidade" defaultValue={fornecedor?.cidade ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="estado">Estado</Label>
          <Input id="estado" name="estado" defaultValue={fornecedor?.estado ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="prazo_entrega_dias">Prazo de entrega (dias)</Label>
          <Input id="prazo_entrega_dias" name="prazo_entrega_dias" type="number" min={0} defaultValue={fornecedor?.prazo_entrega_dias ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="pedido_minimo">Pedido mínimo (R$)</Label>
          <Input id="pedido_minimo" name="pedido_minimo" type="number" step="0.01" min={0} defaultValue={fornecedor?.pedido_minimo ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="regioes_atendidas">Regiões atendidas</Label>
          <Input id="regioes_atendidas" name="regioes_atendidas" defaultValue={fornecedor?.regioes_atendidas ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="frete">Frete</Label>
          <Input id="frete" name="frete" defaultValue={fornecedor?.frete ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="condicoes_pagamento">Condições de pagamento</Label>
          <Input id="condicoes_pagamento" name="condicoes_pagamento" defaultValue={fornecedor?.condicoes_pagamento ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={fornecedor?.observacoes ?? ""} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : fornecedor ? "Salvar alterações" : "Cadastrar fornecedor"}
      </Button>
    </form>
  );
}
