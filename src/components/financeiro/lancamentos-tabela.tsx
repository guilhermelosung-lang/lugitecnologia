"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { marcarComoPagoAction, reabrirLancamentoAction, excluirLancamentoAction } from "@/lib/actions/financeiro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/types/database.types";

type Lancamento = Tables<"financeiro_lancamentos"> & {
  fornecedores: { nome: string } | null;
  obras: { nome: string } | null;
};

const CATEGORIA_LABEL: Record<string, string> = {
  orcamento: "Orçamento",
  fornecedor: "Fornecedor",
  despesa_fixa: "Despesa fixa",
  salario: "Salário",
  frete: "Frete",
  outro: "Outro",
};

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export function LancamentosTabela({ lancamentos }: { lancamentos: Lancamento[] }) {
  const [pending, startTransition] = useTransition();
  const [pagandoId, setPagandoId] = useState<string | null>(null);
  const [dataPagamento, setDataPagamento] = useState(hoje());
  const router = useRouter();

  function confirmarPagamento(id: string) {
    startTransition(async () => {
      await marcarComoPagoAction(id, dataPagamento);
      setPagandoId(null);
      router.refresh();
    });
  }

  function reabrir(id: string) {
    startTransition(async () => {
      await reabrirLancamentoAction(id);
      router.refresh();
    });
  }

  function excluir(id: string) {
    if (!confirm("Excluir este lançamento?")) return;
    startTransition(async () => {
      await excluirLancamentoAction(id);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">Descrição</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Vínculo</th>
            <th className="px-4 py-3">Vencimento</th>
            <th className="px-4 py-3">Valor</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {lancamentos.map((l) => {
            const atrasado = l.status === "pendente" && l.data_vencimento < hoje();
            return (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3 font-medium text-foreground">{l.descricao}</td>
                <td className="px-4 py-3 text-muted">{CATEGORIA_LABEL[l.categoria] ?? l.categoria}</td>
                <td className="px-4 py-3 text-muted">{l.fornecedores?.nome ?? l.obras?.nome ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{l.data_vencimento}</td>
                <td className="px-4 py-3 font-medium text-foreground">R$ {Number(l.valor).toFixed(2)}</td>
                <td className="px-4 py-3">
                  {l.status === "pago" ? (
                    <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                      Pago em {l.data_pagamento}
                    </span>
                  ) : atrasado ? (
                    <span className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                      Atrasado
                    </span>
                  ) : (
                    <span className="rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                      Pendente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {l.status === "pendente" && pagandoId !== l.id && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setPagandoId(l.id)}
                        className="text-xs font-medium text-accent-dark hover:underline disabled:opacity-60"
                      >
                        Marcar como pago
                      </button>
                    )}
                    {pagandoId === l.id && (
                      <div className="flex items-center gap-1">
                        <Input
                          type="date"
                          value={dataPagamento}
                          onChange={(e) => setDataPagamento(e.target.value)}
                          className="w-36 px-2 py-1 text-xs"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          disabled={pending}
                          onClick={() => confirmarPagamento(l.id)}
                        >
                          OK
                        </Button>
                      </div>
                    )}
                    {l.status === "pago" && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => reabrir(l.id)}
                        className="text-xs font-medium text-muted hover:underline disabled:opacity-60"
                      >
                        Reabrir
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => excluir(l.id)}
                      className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {lancamentos.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted">
                Nenhum lançamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
