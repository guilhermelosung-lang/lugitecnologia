"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusOrcamentoAction } from "@/lib/actions/orcamentos";
import { ORCAMENTO_STATUS, ORCAMENTO_TRANSICOES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const STATUS_LABEL = Object.fromEntries(ORCAMENTO_STATUS.map((s) => [s.value, s.label]));

const STATUS_COR: Record<string, string> = {
  rascunho: "bg-border text-muted",
  aguardando_aprovacao: "bg-warning/15 text-warning",
  enviado: "bg-accent/10 text-accent-dark",
  visualizado: "bg-accent/10 text-accent-dark",
  aprovado: "bg-success/15 text-success",
  recusado: "bg-danger/15 text-danger",
  vencido: "bg-danger/15 text-danger",
  cancelado: "bg-border text-muted",
};

export function StatusPanel({
  orcamentoId,
  status,
  podeEditar,
}: {
  orcamentoId: string;
  status: string;
  podeEditar: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();
  const opcoes = ORCAMENTO_TRANSICOES[status] ?? [];

  function mudar(novoStatus: string) {
    setErro(null);
    startTransition(async () => {
      try {
        await atualizarStatusOrcamentoAction(orcamentoId, novoStatus);
        router.refresh();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao atualizar status.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COR[status] ?? "bg-border text-muted"}`}>
        {STATUS_LABEL[status] ?? status}
      </span>
      {podeEditar &&
        opcoes.map((op) => (
          <Button
            key={op}
            type="button"
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            disabled={pending}
            onClick={() => mudar(op)}
          >
            {STATUS_LABEL[op] ?? op}
          </Button>
        ))}
      {erro && <p className="w-full text-sm text-danger">{erro}</p>}
    </div>
  );
}
