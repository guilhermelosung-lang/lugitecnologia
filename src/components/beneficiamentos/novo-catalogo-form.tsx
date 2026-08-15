"use client";

import { useActionState, useRef, useEffect } from "react";
import { criarBeneficiamentoCatalogoAction } from "@/lib/actions/beneficiamentos";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NovoCatalogoForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(criarBeneficiamentoCatalogoAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3">
      <div>
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" name="nome" required placeholder="ex: Furo Ø35mm" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="tipo">Tipo</Label>
        <Select id="tipo" name="tipo" defaultValue="furo" className="mt-1.5">
          <option value="furo">Furo</option>
          <option value="recorte">Recorte</option>
          <option value="lapidacao">Lapidação</option>
          <option value="chanfro">Chanfro</option>
          <option value="polimento">Polimento</option>
          <option value="outro">Outro</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="preco_unitario">Preço unit. (R$)</Label>
        <Input id="preco_unitario" name="preco_unitario" type="number" step="0.01" min={0} className="mt-1.5" />
      </div>
      <div className="flex-1 min-w-[160px]">
        <Label htmlFor="descricao">Descrição</Label>
        <Input id="descricao" name="descricao" className="mt-1.5" />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Salvando..." : "Adicionar ao catálogo"}
      </Button>
      {state?.error && <p className="w-full text-sm text-danger">{state.error}</p>}
    </form>
  );
}
