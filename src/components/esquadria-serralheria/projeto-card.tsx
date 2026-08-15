"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusProjetoAction, excluirProjetoEsquadriaSerralheriaAction } from "@/lib/actions/esquadria-serralheria";
import { Select } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

type Projeto = Tables<"projetos_esquadria_serralheria"> & { obras: { nome: string } | null };

const CATEGORIA_LABEL: Record<string, string> = { esquadria_aluminio: "Esquadria de Alumínio", serralheria: "Serralheria" };
const STATUS_LABEL: Record<string, string> = {
  orcamento: "Orçamento",
  aprovado: "Aprovado",
  em_producao: "Em produção",
  instalado: "Instalado",
  cancelado: "Cancelado",
};

export function ProjetoCard({ projeto, podeGerenciar }: { projeto: Projeto; podeGerenciar: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted">{CATEGORIA_LABEL[projeto.categoria]} · {projeto.obras?.nome ?? "—"}</p>
          <h3 className="font-heading text-base font-semibold text-primary">{projeto.descricao}</h3>
          {projeto.especificacao && <p className="mt-1 text-sm text-foreground">{projeto.especificacao}</p>}
          <p className="mt-1 text-xs text-muted">
            {projeto.quantidade}x
            {projeto.material ? ` · ${projeto.material}` : ""}
            {projeto.cor ? ` · ${projeto.cor}` : ""}
            {projeto.valor_estimado != null ? ` · R$ ${Number(projeto.valor_estimado).toFixed(2)}` : ""}
          </p>
          <p className="text-xs text-muted">Criado em {formatDateTime(projeto.created_at)}</p>
        </div>
        {podeGerenciar ? (
          <Select
            defaultValue={projeto.status}
            className="w-40 text-xs"
            disabled={pending}
            onChange={(e) => {
              const status = e.target.value as "orcamento" | "aprovado" | "em_producao" | "instalado" | "cancelado";
              startTransition(async () => {
                await atualizarStatusProjetoAction(projeto.id, status);
                router.refresh();
              });
            }}
          >
            {Object.entries(STATUS_LABEL).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
        ) : (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground">
            {STATUS_LABEL[projeto.status]}
          </span>
        )}
      </div>
      {podeGerenciar && (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm("Excluir este projeto?")) return;
            startTransition(async () => {
              await excluirProjetoEsquadriaSerralheriaAction(projeto.id);
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
