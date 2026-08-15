"use client";

import { useActionState } from "react";
import { criarEmpresaManualAction } from "@/lib/actions/onboarding";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardBody } from "@/components/ui/card";

export function CriarEmpresaForm({
  nomeInicial,
  razaoSocialInicial,
  avisoInicial,
}: {
  nomeInicial?: string;
  razaoSocialInicial?: string;
  avisoInicial?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    criarEmpresaManualAction,
    avisoInicial ? { error: avisoInicial } : undefined
  );

  return (
    <Card className="mx-auto mt-16 max-w-md">
      <CardBody>
        <h1 className="mb-1 font-heading text-xl font-semibold text-primary">
          Complete o cadastro da sua empresa
        </h1>
        <p className="mb-6 text-sm text-muted">
          Só mais um passo antes de acessar o painel.
        </p>
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="nome">Seu nome completo</Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={nomeInicial}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="razaoSocial">Razão social da empresa</Label>
            <Input
              id="razaoSocial"
              name="razaoSocial"
              defaultValue={razaoSocialInicial}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="cnpj">CPF ou CNPJ da empresa</Label>
            <Input id="cnpj" name="cnpj" required className="mt-1.5" />
          </div>
          {state?.error && (
            <p className="text-sm text-danger" role="alert">
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Criando..." : "Concluir cadastro"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
