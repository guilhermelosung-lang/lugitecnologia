"use client";

import { useActionState } from "react";
import { atualizarStatusPlanoAction } from "@/lib/actions/planos";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

export function StatusPlanoForm({ status, expiraEm }: { status: string; expiraEm: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(atualizarStatusPlanoAction, undefined);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <div>
        <Select name="plano_status" defaultValue={status} className="text-xs">
          <option value="sem_plano">Sem plano</option>
          <option value="trial">Teste grátis</option>
          <option value="ativo">Ativo</option>
          <option value="inadimplente">Inadimplente</option>
          <option value="cancelado">Cancelado</option>
        </Select>
      </div>
      <div>
        <Input name="plano_expira_em" type="date" defaultValue={expiraEm} className="text-xs" />
      </div>
      <Button type="submit" variant="secondary" className="px-3 py-1.5 text-xs" disabled={pending}>
        {pending ? "Salvando..." : "Atualizar status"}
      </Button>
      {state?.error && <p className="w-full text-xs text-danger">{state.error}</p>}
    </form>
  );
}
