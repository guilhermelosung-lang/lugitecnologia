"use client";

import { useActionState, useRef, useEffect } from "react";
import { criarProjetoEsquadriaSerralheriaAction } from "@/lib/actions/esquadria-serralheria";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };

export function NovoProjetoForm({ obras }: { obras: ObraOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(criarProjetoEsquadriaSerralheriaAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
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
          <Label htmlFor="categoria">Categoria *</Label>
          <Select id="categoria" name="categoria" defaultValue="esquadria_aluminio" className="mt-1.5">
            <option value="esquadria_aluminio">Esquadria de Alumínio</option>
            <option value="serralheria">Serralheria</option>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="descricao">Descrição *</Label>
          <Input id="descricao" name="descricao" required placeholder="ex: Portão basculante 3x2,20m" className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="especificacao">Especificação (medidas, detalhes)</Label>
          <Textarea id="especificacao" name="especificacao" rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="material">Material</Label>
          <Input id="material" name="material" placeholder="ex: Alumínio, ferro" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" name="cor" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input id="quantidade" name="quantidade" type="number" step="1" min={1} defaultValue={1} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="valor_estimado">Valor estimado (R$)</Label>
          <Input id="valor_estimado" name="valor_estimado" type="number" step="0.01" min={0} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" rows={2} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Cadastrar projeto"}
      </Button>
    </form>
  );
}
