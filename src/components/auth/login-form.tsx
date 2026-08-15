"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardBody } from "@/components/ui/card";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    signInAction,
    undefined
  );

  return (
    <Card>
      <CardBody>
        <h1 className="mb-1 font-heading text-xl font-semibold text-primary">
          Entrar
        </h1>
        <p className="mb-6 text-sm text-muted">
          Acesse o painel de gestão da sua empresa.
        </p>
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
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
              autoComplete="current-password"
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
            {pending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Ainda não tem conta?{" "}
          <Link href="/signup" className="font-medium text-accent-dark hover:underline">
            Criar empresa
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
