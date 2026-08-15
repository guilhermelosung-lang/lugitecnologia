"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { moverEtapaProducaoAction } from "@/lib/actions/producao";
import { ETAPAS_PRODUCAO } from "@/lib/constants";

type Obra = {
  id: string;
  nome: string;
  status: string;
  data_prevista: string | null;
  clientes: { nome: string } | null;
};

export function ProducaoBoard({ obras, podeMover }: { obras: Obra[]; podeMover: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function mover(obraId: string, novoStatus: string) {
    startTransition(async () => {
      await moverEtapaProducaoAction(obraId, novoStatus);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {ETAPAS_PRODUCAO.map((etapa, idx) => {
        const daEtapa = obras.filter((o) => o.status === etapa.value);
        return (
          <div key={etapa.value} className="w-72 shrink-0">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{etapa.label}</h3>
              <span className="text-xs text-muted">{daEtapa.length}</span>
            </div>
            <div className="space-y-2">
              {daEtapa.map((obra) => (
                <div key={obra.id} className="rounded-xl border border-border bg-surface p-3">
                  <Link href={`/obras/${obra.id}`} className="text-sm font-medium text-primary hover:text-accent-dark">
                    {obra.nome}
                  </Link>
                  <p className="text-xs text-muted">{obra.clientes?.nome ?? "—"}</p>
                  {obra.data_prevista && <p className="text-xs text-muted">Previsão: {obra.data_prevista}</p>}
                  {podeMover && (
                    <div className="mt-2 flex justify-between">
                      <button
                        type="button"
                        disabled={pending || idx === 0}
                        onClick={() => mover(obra.id, ETAPAS_PRODUCAO[idx - 1].value)}
                        className="text-xs font-medium text-muted hover:underline disabled:opacity-30"
                      >
                        ← Voltar
                      </button>
                      <button
                        type="button"
                        disabled={pending || idx === ETAPAS_PRODUCAO.length - 1}
                        onClick={() => mover(obra.id, ETAPAS_PRODUCAO[idx + 1].value)}
                        className="text-xs font-medium text-accent-dark hover:underline disabled:opacity-30"
                      >
                        Avançar →
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {daEtapa.length === 0 && <p className="text-xs text-muted">Nenhuma obra nesta etapa.</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
