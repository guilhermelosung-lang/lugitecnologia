"use client";

import { useActionState } from "react";
import { criarPrecoVidroAction, atualizarPrecoVidroAction } from "@/lib/actions/precos-vidro";
import { TIPO_VIDRO_OPCOES } from "@/lib/constants";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FornecedorOption = { id: string; nome: string };

export function PrecoVidroForm({
  preco,
  fornecedores,
}: {
  preco?: Tables<"tabela_precos_vidro">;
  fornecedores: FornecedorOption[];
}) {
  const action = preco ? atualizarPrecoVidroAction.bind(null, preco.id) : criarPrecoVidroAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="tipo_vidro">Tipo de vidro *</Label>
          <Select id="tipo_vidro" name="tipo_vidro" defaultValue={preco?.tipo_vidro ?? "incolor"} required className="mt-1.5">
            {TIPO_VIDRO_OPCOES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" name="cor" defaultValue={preco?.cor ?? "incolor"} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="espessura_mm">Espessura (mm) *</Label>
          <Select id="espessura_mm" name="espessura_mm" defaultValue={preco?.espessura_mm ?? 8} required className="mt-1.5">
            {[4, 6, 8, 10, 12, 15, 19].map((v) => (
              <option key={v} value={v}>{v} mm</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="fornecedor_id">Fornecedor (opcional)</Label>
          <Select id="fornecedor_id" name="fornecedor_id" defaultValue={preco?.fornecedor_id ?? ""} className="mt-1.5">
            <option value="">Genérico (qualquer fornecedor)</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="preco_vidro_m2">Preço do vidro por m² (R$) *</Label>
          <Input id="preco_vidro_m2" name="preco_vidro_m2" type="number" step="0.01" min={0} defaultValue={preco?.preco_vidro_m2} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="preco_tempera_m2">Custo da têmpera por m² (R$)</Label>
          <Input id="preco_tempera_m2" name="preco_tempera_m2" type="number" step="0.01" min={0} defaultValue={preco?.preco_tempera_m2 ?? 0} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="margem_padrao_percentual">Margem padrão de venda (%)</Label>
          <Input id="margem_padrao_percentual" name="margem_padrao_percentual" type="number" step="0.1" min={0} defaultValue={preco?.margem_padrao_percentual ?? 0} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" defaultValue={preco?.observacoes ?? ""} rows={2} className="mt-1.5" />
        </div>
      </div>

      <p className="text-xs text-muted">
        Preço de custo por m² = vidro + têmpera. Preço de venda sugerido = custo × (1 + margem padrão).
        Ao vincular um item de orçamento a um cálculo, o sistema usa esses valores automaticamente pela
        espessura do cálculo — sem digitação manual.
      </p>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : preco ? "Salvar alterações" : "Cadastrar preço"}
      </Button>
    </form>
  );
}
