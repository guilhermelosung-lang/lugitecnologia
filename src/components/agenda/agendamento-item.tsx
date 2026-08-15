"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { concluirAgendamentoAction, cancelarAgendamentoAction, excluirAgendamentoAction } from "@/lib/actions/agenda";
import type { Tables } from "@/types/database.types";

type Agendamento = Tables<"agendamentos"> & {
  obras: { nome: string } | null;
  usuarios: { nome: string } | null;
};

const TIPO_LABEL: Record<string, string> = {
  medicao: "Medição",
  instalacao: "Instalação",
  visita_tecnica: "Visita técnica",
  manutencao: "Manutenção",
};

const STATUS_COR: Record<string, string> = {
  agendado: "bg-accent/10 text-accent-dark border-accent/30",
  concluido: "bg-success/10 text-success border-success/30",
  cancelado: "bg-border text-muted border-border",
  reagendado: "bg-warning/10 text-warning border-warning/30",
};

export function AgendamentoItem({ agendamento, podeGerenciar, podeConcluir }: { agendamento: Agendamento; podeGerenciar: boolean; podeConcluir: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const hora = new Date(agendamento.data_hora_inicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-muted">{hora} · {TIPO_LABEL[agendamento.tipo]} · {agendamento.obras?.nome ?? "—"}</p>
        <p className="font-medium text-foreground">{agendamento.titulo}</p>
        {agendamento.usuarios?.nome && <p className="text-xs text-muted">Responsável: {agendamento.usuarios.nome}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COR[agendamento.status]}`}>
          {agendamento.status}
        </span>
        {agendamento.status === "agendado" && (
          <>
            {podeConcluir && (
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(async () => { await concluirAgendamentoAction(agendamento.id); router.refresh(); })}
                className="text-xs font-medium text-accent-dark hover:underline disabled:opacity-60"
              >
                Concluir
              </button>
            )}
            {podeGerenciar && (
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(async () => { await cancelarAgendamentoAction(agendamento.id); router.refresh(); })}
                className="text-xs font-medium text-muted hover:underline disabled:opacity-60"
              >
                Cancelar
              </button>
            )}
          </>
        )}
        {podeGerenciar && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Excluir este agendamento?")) return;
              startTransition(async () => { await excluirAgendamentoAction(agendamento.id); router.refresh(); });
            }}
            className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
