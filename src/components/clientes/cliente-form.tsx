"use client";

import { useActionState } from "react";
import { criarClienteAction, atualizarClienteAction } from "@/lib/actions/clientes";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";

const ORIGENS = ["Indicação", "Site", "Instagram", "WhatsApp", "Outro"];
const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export function ClienteForm({ cliente }: { cliente?: Tables<"clientes"> }) {
  const action = cliente
    ? atualizarClienteAction.bind(null, cliente.id)
    : criarClienteAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="nome">Nome / Razão social *</Label>
          <Input id="nome" name="nome" defaultValue={cliente?.nome} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cpf_cnpj">CPF / CNPJ</Label>
          <Input id="cpf_cnpj" name="cpf_cnpj" defaultValue={cliente?.cpf_cnpj ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="origem">Origem</Label>
          <select
            id="origem"
            name="origem"
            defaultValue={cliente?.origem ?? ""}
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="">Selecione</option>
            {ORIGENS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" name="telefone" defaultValue={cliente?.telefone ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={cliente?.whatsapp ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={cliente?.email ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" name="endereco" defaultValue={cliente?.endereco ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="bairro">Bairro</Label>
          <Input id="bairro" name="bairro" defaultValue={cliente?.bairro ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" name="cep" defaultValue={cliente?.cep ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" name="cidade" defaultValue={cliente?.cidade ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="estado">Estado</Label>
          <select
            id="estado"
            name="estado"
            defaultValue={cliente?.estado ?? ""}
            className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="">Selecione</option>
            {ESTADOS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="responsavel">Responsável</Label>
          <Input id="responsavel" name="responsavel" defaultValue={cliente?.responsavel ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={cliente?.observacoes ?? ""} className="mt-1.5" />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : cliente ? "Salvar alterações" : "Cadastrar cliente"}
        </Button>
      </div>
    </form>
  );
}
