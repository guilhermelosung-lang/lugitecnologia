"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { excluirBeneficiamentoLancamentoAction } from "@/lib/actions/beneficiamentos";
import { formatDateTime } from "@/lib/utils";

type Lancamento = {
  id: string;
  peca_referencia: string;
  quantidade: number;
  observacoes: string | null;
  created_at: string;
  beneficiamentos_catalogo: { nome: string } | null;
  obras: { nome: string } | null;
};

export function LancamentoLinha({ lancamento, podeGerenciar }: { lancamento: Lancamento; podeGerenciar: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <tr className="border-b border-border last:border-0 hover:bg-background">
      <td className="px-4 py-3 font-medium text-foreground">{lancamento.beneficiamentos_catalogo?.nome ?? "—"}</td>
      <td className="px-4 py-3 text-muted">{lancamento.obras?.nome ?? "—"}</td>
      <td className="px-4 py-3 text-muted">{lancamento.peca_referencia}</td>
      <td className="px-4 py-3 text-muted">{lancamento.quantidade}</td>
      <td className="px-4 py-3 text-muted">{formatDateTime(lancamento.created_at)}</td>
      {podeGerenciar && (
        <td className="px-4 py-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Remover este registro?")) return;
              startTransition(async () => {
                await excluirBeneficiamentoLancamentoAction(lancamento.id);
                router.refresh();
              });
            }}
            className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
          >
            Remover
          </button>
        </td>
      )}
    </tr>
  );
}
