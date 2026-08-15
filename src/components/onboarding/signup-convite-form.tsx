"use client";

import { useActionState } from "react";
import { signUpParaConviteAction } from "@/lib/actions/onboarding";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupConviteForm({
  token,
  emailConvidado,
  nomeSugerido,
}: {
  token: string;
  emailConvidado: string;
  nomeSugerido?: string | null;
}) {
  const action = signUpParaConviteAction.bind(null, token);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="nome">Seu nome completo</Label>
        <Input id="nome" name="nome" defaultValue={nomeSugerido ?? ""} required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" defaultValue={emailConvidado} readOnly className="mt-1.5 bg-background" />
      </div>
      <div>
        <Label htmlFor="password">Crie uma senha</Label>
        <Input id="password" name="password" type="password" minLength={8} required className="mt-1.5" />
      </div>
      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando conta..." : "Criar conta e entrar"}
      </Button>
    </form>
  );
}
