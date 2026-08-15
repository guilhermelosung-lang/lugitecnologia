"use client";

import { useActionState } from "react";
import { criarConviteAction } from "@/lib/actions/usuarios";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteForm({ perfis }: { perfis: Tables<"perfis">[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    criarConviteAction,
    undefined
  );

  return (
    <form action={action} className="grid gap-4 md:grid-cols-4 md:items-end">
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="nome">Nome (opcional)</Label>
        <Input id="nome" name="nome" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="perfil_id">Perfil</Label>
        <select
          id="perfil_id"
          name="perfil_id"
          required
          className="mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {perfis.map((p) => (
            <option key={p.id} value={p.id} className="capitalize">
              {p.nome}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Convidando..." : "Convidar"}
      </Button>
      {state?.error && (
        <p className="text-sm text-danger md:col-span-4" role="alert">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-success md:col-span-4">
          Convite criado. Compartilhe o link em &quot;Convites pendentes&quot; abaixo com a pessoa.
        </p>
      )}
    </form>
  );
}
