"use client";

import { useActionState } from "react";
import { aceitarConviteAction } from "@/lib/actions/onboarding";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function AceitarConviteButton({ token }: { token: string }) {
  const action = aceitarConviteAction.bind(null, token);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async () => action(),
    undefined
  );

  return (
    <form action={formAction}>
      {state?.error && <p className="mb-3 text-sm text-danger" role="alert">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando na empresa..." : "Aceitar convite"}
      </Button>
    </form>
  );
}
