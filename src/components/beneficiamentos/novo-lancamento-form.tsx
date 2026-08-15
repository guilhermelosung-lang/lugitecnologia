"use client";

import { useActionState, useRef, useEffect } from "react";
import { registrarBeneficiamentoAction } from "@/lib/actions/beneficiamentos";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CatalogoOption = { id: string; nome: string };
type ObraOption = { id: string; nome: string };

export function NovoLancamentoForm({ catalogo, obras }: { catalogo: CatalogoOption[]; obras: ObraOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(registrarBeneficiamentoAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="grid gap-3 md:grid-cols-6 md:items-end">
      <div className="md:col-span-2">
        <Label htmlFor="beneficiamento_id">Beneficiamento</Label>
        <Select id="beneficiamento_id" name="beneficiamento_id" required className="mt-1.5">
          <option value="">Selecione</option>
          {catalogo.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="obra_id">Obra</Label>
        <Select id="obra_id" name="obra_id" defaultValue="" className="mt-1.5">
          <option value="">Nenhuma</option>
          {obras.map((o) => (
            <option key={o.id} value={o.id}>{o.nome}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="peca_referencia">Peça/local</Label>
        <Input id="peca_referencia" name="peca_referencia" required placeholder="ex: V1 box banheiro" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="quantidade">Qtd.</Label>
        <Input id="quantidade" name="quantidade" type="number" step="1" min={1} defaultValue={1} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Input id="observacoes" name="observacoes" className="mt-1.5" />
      </div>
      <div className="md:col-span-6">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Registrando..." : "Registrar beneficiamento"}
        </Button>
        {state?.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
      </div>
    </form>
  );
}
