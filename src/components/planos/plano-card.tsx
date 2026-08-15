"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { selecionarPlanoAction } from "@/lib/actions/planos";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/database.types";

export function PlanoCard({
  plano,
  selecionado,
  podeSelecionar,
}: {
  plano: Tables<"planos">;
  selecionado: boolean;
  podeSelecionar: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div
      className={`rounded-2xl border p-6 ${
        selecionado ? "border-accent bg-accent/5 ring-2 ring-accent/20" : "border-border bg-surface"
      }`}
    >
      {selecionado && (
        <span className="mb-2 inline-block rounded-full bg-accent-dark/10 px-2.5 py-1 text-xs font-medium text-accent-dark">
          Plano atual
        </span>
      )}
      <h3 className="font-heading text-lg font-semibold text-primary">{plano.nome}</h3>
      <p className="mt-1 text-sm text-muted">{plano.descricao}</p>
      <p className="mt-3 font-heading text-2xl font-bold text-foreground">
        {plano.preco_mensal > 0 ? `R$ ${plano.preco_mensal.toFixed(2)}` : "Grátis"}
        {plano.preco_mensal > 0 && <span className="text-sm font-normal text-muted">/mês</span>}
      </p>
      <ul className="mt-4 space-y-1 text-sm text-foreground">
        <li>{plano.limite_usuarios ? `Até ${plano.limite_usuarios} usuários` : "Usuários ilimitados"}</li>
        <li>{plano.limite_obras_mes ? `Até ${plano.limite_obras_mes} obras/mês` : "Obras ilimitadas"}</li>
        {plano.recursos.map((r) => (
          <li key={r}>✓ {r}</li>
        ))}
      </ul>
      {podeSelecionar && !selecionado && (
        <Button
          type="button"
          variant="secondary"
          className="mt-4 w-full"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await selecionarPlanoAction(plano.id);
              router.refresh();
            })
          }
        >
          {pending ? "Selecionando..." : "Selecionar este plano"}
        </Button>
      )}
    </div>
  );
}
