"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { excluirBeneficiamentoCatalogoAction } from "@/lib/actions/beneficiamentos";
import type { Tables } from "@/types/database.types";

const TIPO_LABEL: Record<string, string> = {
  furo: "Furo",
  recorte: "Recorte",
  lapidacao: "Lapidação",
  chanfro: "Chanfro",
  polimento: "Polimento",
  outro: "Outro",
};

export function CatalogoItem({ item, podeGerenciar }: { item: Tables<"beneficiamentos_catalogo">; podeGerenciar: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm">
      <div>
        <p className="font-medium text-foreground">{item.nome}</p>
        <p className="text-xs text-muted">
          {TIPO_LABEL[item.tipo] ?? item.tipo}
          {item.preco_unitario != null ? ` · R$ ${Number(item.preco_unitario).toFixed(2)}` : ""}
          {item.descricao ? ` · ${item.descricao}` : ""}
        </p>
      </div>
      {podeGerenciar && (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm("Remover este item do catálogo?")) return;
            startTransition(async () => {
              await excluirBeneficiamentoCatalogoAction(item.id);
              router.refresh();
            });
          }}
          className="shrink-0 text-xs font-medium text-danger hover:underline disabled:opacity-60"
        >
          Remover
        </button>
      )}
    </li>
  );
}
