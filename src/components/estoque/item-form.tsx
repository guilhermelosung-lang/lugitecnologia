"use client";

import { useActionState } from "react";
import { criarItemEstoqueAction, atualizarItemEstoqueAction } from "@/lib/actions/estoque";
import { ITEM_CATEGORIAS } from "@/lib/constants";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ItemEstoqueForm({
  item,
  fornecedores,
}: {
  item?: Tables<"itens_estoque">;
  fornecedores: Pick<Tables<"fornecedores">, "id" | "nome">[];
}) {
  const action = item ? atualizarItemEstoqueAction.bind(null, item.id) : criarItemEstoqueAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="nome">Nome do item *</Label>
          <Input id="nome" name="nome" defaultValue={item?.nome} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="categoria">Categoria *</Label>
          <Select id="categoria" name="categoria" required defaultValue={item?.categoria ?? "outro"} className="mt-1.5">
            {ITEM_CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="unidade">Unidade</Label>
          <Input id="unidade" name="unidade" defaultValue={item?.unidade ?? "un"} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="quantidade_minima">Quantidade mínima</Label>
          <Input id="quantidade_minima" name="quantidade_minima" type="number" step="0.001" min={0} defaultValue={item?.quantidade_minima ?? 0} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="custo_unitario">Custo unitário (R$)</Label>
          <Input id="custo_unitario" name="custo_unitario" type="number" step="0.01" min={0} defaultValue={item?.custo_unitario ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="fornecedor_id">Fornecedor</Label>
          <Select id="fornecedor_id" name="fornecedor_id" defaultValue={item?.fornecedor_id ?? ""} className="mt-1.5">
            <option value="">Nenhum</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={item?.observacoes ?? ""} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : item ? "Salvar alterações" : "Cadastrar item"}
      </Button>
    </form>
  );
}
