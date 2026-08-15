"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusChamadoAction, excluirChamadoAction } from "@/lib/actions/garantia";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Chamado = Tables<"chamados_garantia"> & { obras: { nome: string } | null };

const TIPO_LABEL: Record<string, string> = { garantia: "Garantia", assistencia: "Assistência", reclamacao: "Reclamação" };
const STATUS_LABEL: Record<string, string> = { aberto: "Aberto", em_atendimento: "Em atendimento", resolvido: "Resolvido", cancelado: "Cancelado" };
const STATUS_COR: Record<string, string> = {
  aberto: "bg-danger/10 text-danger border-danger/30",
  em_atendimento: "bg-warning/10 text-warning border-warning/30",
  resolvido: "bg-success/10 text-success border-success/30",
  cancelado: "bg-border text-muted border-border",
};
const PRIORIDADE_LABEL: Record<string, string> = { baixa: "Baixa", media: "Média", alta: "Alta" };

export function ChamadoCard({ chamado }: { chamado: Chamado }) {
  const [pending, startTransition] = useTransition();
  const [resolvendo, setResolvendo] = useState(false);
  const [resolucao, setResolucao] = useState("");
  const router = useRouter();

  function mudarStatus(status: "aberto" | "em_atendimento" | "resolvido" | "cancelado") {
    startTransition(async () => {
      await atualizarStatusChamadoAction(chamado.id, status, status === "resolvido" ? resolucao : undefined);
      setResolvendo(false);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted">{chamado.obras?.nome ?? "—"} · {TIPO_LABEL[chamado.tipo]} · Prioridade {PRIORIDADE_LABEL[chamado.prioridade]}</p>
          <h3 className="font-heading text-base font-semibold text-primary">{chamado.titulo}</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COR[chamado.status]}`}>
          {STATUS_LABEL[chamado.status]}
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground">{chamado.descricao}</p>
      <p className="mt-2 text-xs text-muted">Aberto em {formatDateTime(chamado.data_abertura)}</p>

      {chamado.status === "resolvido" && chamado.resolucao && (
        <p className="mt-2 rounded-lg bg-success/5 p-2 text-xs text-foreground">
          <strong>Resolução:</strong> {chamado.resolucao}
        </p>
      )}

      {chamado.status !== "resolvido" && chamado.status !== "cancelado" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {chamado.status === "aberto" && (
            <Button variant="secondary" className="px-3 py-1.5 text-xs" disabled={pending} onClick={() => mudarStatus("em_atendimento")}>
              Iniciar atendimento
            </Button>
          )}
          {!resolvendo ? (
            <Button variant="secondary" className="px-3 py-1.5 text-xs" disabled={pending} onClick={() => setResolvendo(true)}>
              Marcar como resolvido
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <Textarea
                placeholder="O que foi feito para resolver?"
                value={resolucao}
                onChange={(e) => setResolucao(e.target.value)}
                rows={2}
              />
              <Button className="w-fit px-3 py-1.5 text-xs" disabled={pending || !resolucao.trim()} onClick={() => mudarStatus("resolvido")}>
                Confirmar resolução
              </Button>
            </div>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => mudarStatus("cancelado")}
            className="text-xs font-medium text-muted hover:underline disabled:opacity-60"
          >
            Cancelar chamado
          </button>
        </div>
      )}
      {(chamado.status === "resolvido" || chamado.status === "cancelado") && (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm("Excluir este chamado?")) return;
            startTransition(async () => {
              await excluirChamadoAction(chamado.id);
              router.refresh();
            });
          }}
          className="mt-3 text-xs font-medium text-danger hover:underline disabled:opacity-60"
        >
          Excluir
        </button>
      )}
    </div>
  );
}
