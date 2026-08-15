"use client";

import { useActionState } from "react";
import { atualizarEmpresaAction } from "@/lib/actions/empresa";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmpresaForm({ empresa }: { empresa: Tables<"empresas"> }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    atualizarEmpresaAction,
    undefined
  );

  return (
    <form action={action} className="space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">
          Dados da empresa
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="razao_social">Razão social *</Label>
            <Input id="razao_social" name="razao_social" defaultValue={empresa.razao_social} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="nome_fantasia">Nome fantasia</Label>
            <Input id="nome_fantasia" name="nome_fantasia" defaultValue={empresa.nome_fantasia ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label>CPF/CNPJ</Label>
            <Input value={empresa.cpf_cnpj} disabled className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="responsavel">Responsável</Label>
            <Input id="responsavel" name="responsavel" defaultValue={empresa.responsavel ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" name="telefone" defaultValue={empresa.telefone ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={empresa.whatsapp ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" defaultValue={empresa.email ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="chave_pix">Chave Pix</Label>
            <Input id="chave_pix" name="chave_pix" defaultValue={empresa.chave_pix ?? ""} className="mt-1.5" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" name="endereco" defaultValue={empresa.endereco ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" name="cidade" defaultValue={empresa.cidade ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Input id="estado" name="estado" defaultValue={empresa.estado ?? ""} className="mt-1.5" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">
          Regras comerciais padrão
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="validade_orcamento_dias">Validade do orçamento (dias)</Label>
            <Input id="validade_orcamento_dias" name="validade_orcamento_dias" type="number" min={1} defaultValue={empresa.validade_orcamento_dias} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="prazo_padrao_dias">Prazo padrão (dias)</Label>
            <Input id="prazo_padrao_dias" name="prazo_padrao_dias" type="number" min={1} defaultValue={empresa.prazo_padrao_dias} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="garantia_padrao_meses">Garantia padrão (meses)</Label>
            <Input id="garantia_padrao_meses" name="garantia_padrao_meses" type="number" min={0} defaultValue={empresa.garantia_padrao_meses} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="margem_minima">Margem mínima (%)</Label>
            <Input id="margem_minima" name="margem_minima" type="number" step="0.01" min={0} defaultValue={empresa.margem_minima} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="percentual_perda">Percentual de perda (%)</Label>
            <Input id="percentual_perda" name="percentual_perda" type="number" step="0.01" min={0} defaultValue={empresa.percentual_perda} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="percentual_imposto">Impostos (%)</Label>
            <Input id="percentual_imposto" name="percentual_imposto" type="number" step="0.01" min={0} defaultValue={empresa.percentual_imposto} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="comissao_padrao">Comissão padrão (%)</Label>
            <Input id="comissao_padrao" name="comissao_padrao" type="number" step="0.01" min={0} defaultValue={empresa.comissao_padrao} className="mt-1.5" />
          </div>
        </div>
        <div className="mt-4 grid gap-4">
          <div>
            <Label htmlFor="condicoes_comerciais">Condições comerciais</Label>
            <Textarea id="condicoes_comerciais" name="condicoes_comerciais" rows={3} defaultValue={empresa.condicoes_comerciais ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="texto_garantia">Texto de garantia</Label>
            <Textarea id="texto_garantia" name="texto_garantia" rows={3} defaultValue={empresa.texto_garantia ?? ""} className="mt-1.5" />
          </div>
        </div>
      </section>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">Configurações salvas.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}
