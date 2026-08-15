"use client";

import { useState } from "react";
import { calcularDiferencas, formatarValor, ACAO_LABEL } from "@/lib/auditoria/utils";
import { formatDateTime } from "@/lib/utils";
import type { Json } from "@/types/database.types";

const COR_ACAO: Record<string, string> = {
  insert: "bg-success/10 text-success border-success/30",
  update: "bg-warning/10 text-warning border-warning/30",
  delete: "bg-danger/10 text-danger border-danger/30",
};

export function AuditoriaLinha({
  registro,
  tabelaLabel,
}: {
  registro: {
    id: string;
    created_at: string;
    acao: string;
    tabela: string;
    registro_id: string;
    dados_anteriores: Json | null;
    dados_novos: Json | null;
    usuarios: { nome: string } | null;
  };
  tabelaLabel: string;
}) {
  const [aberto, setAberto] = useState(false);
  const diffs = calcularDiferencas(
    registro.dados_anteriores as Record<string, unknown> | null,
    registro.dados_novos as Record<string, unknown> | null
  );

  return (
    <>
      <tr className="border-b border-border last:border-0 hover:bg-background">
        <td className="px-4 py-3 text-muted">{formatDateTime(registro.created_at)}</td>
        <td className="px-4 py-3 text-foreground">{registro.usuarios?.nome ?? "Sistema"}</td>
        <td className="px-4 py-3 text-foreground">{tabelaLabel}</td>
        <td className="px-4 py-3">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${COR_ACAO[registro.acao] ?? ""}`}>
            {ACAO_LABEL[registro.acao] ?? registro.acao}
          </span>
        </td>
        <td className="px-4 py-3 text-muted font-mono text-xs">{registro.registro_id.slice(0, 8)}</td>
        <td className="px-4 py-3">
          {(registro.acao === "update" ? diffs.length > 0 : registro.dados_novos || registro.dados_anteriores) && (
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              className="text-xs font-medium text-accent-dark hover:underline"
            >
              {aberto ? "Ocultar" : "Ver detalhes"}
            </button>
          )}
        </td>
      </tr>
      {aberto && (
        <tr className="border-b border-border bg-background/60 last:border-0">
          <td colSpan={6} className="px-4 py-3">
            {registro.acao === "update" && diffs.length > 0 && (
              <table className="w-full text-xs">
                <thead className="text-left uppercase tracking-wide text-muted">
                  <tr>
                    <th className="py-1 pr-4">Campo</th>
                    <th className="py-1 pr-4">De</th>
                    <th className="py-1">Para</th>
                  </tr>
                </thead>
                <tbody>
                  {diffs.map((d) => (
                    <tr key={d.campo}>
                      <td className="py-1 pr-4 font-medium text-foreground">{d.campo}</td>
                      <td className="py-1 pr-4 text-danger/80">{formatarValor(d.de)}</td>
                      <td className="py-1 text-success">{formatarValor(d.para)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {registro.acao === "insert" && registro.dados_novos && (
              <pre className="overflow-x-auto text-xs text-foreground">{JSON.stringify(registro.dados_novos, null, 2)}</pre>
            )}
            {registro.acao === "delete" && registro.dados_anteriores && (
              <pre className="overflow-x-auto text-xs text-foreground">{JSON.stringify(registro.dados_anteriores, null, 2)}</pre>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
