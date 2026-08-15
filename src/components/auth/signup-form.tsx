"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardBody } from "@/components/ui/card";

export function SignupForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    signUpAction,
    undefined
  );

  return (
    <Card>
      <CardBody>
        <h1 className="mb-1 font-heading text-xl font-semibold text-primary">
          Criar conta no sistema de gestão para vidraçarias
        </h1>
        <p className="mb-6 text-sm text-muted">
          Você será o administrador desta conta. Comece com{" "}
          <strong className="text-accent-dark">7 dias grátis</strong>, sem
          cartão de crédito.
        </p>
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="nome">Seu nome completo</Label>
            <Input id="nome" name="nome" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="razaoSocial">Razão social da empresa</Label>
            <Input
              id="razaoSocial"
              name="razaoSocial"
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="cnpj">CPF ou CNPJ da empresa</Label>
            <Input id="cnpj" name="cnpj" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Seu e-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="mt-1.5"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-danger" role="alert">
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Criando conta..." : "Começar teste grátis de 7 dias"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-accent-dark hover:underline">
            Entrar
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
