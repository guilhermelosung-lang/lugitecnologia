"use client";

import { useState } from "react";
import type { ResultadoJanela } from "@/lib/calc/janela";
import { JanelaDesenho } from "@/components/calculadoras/janela-desenho";

export function JanelaResultado({ resultado }: { resultado: ResultadoJanela }) {
  const [mostrarPassos, setMostrarPassos] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Desenho técnico</h2>
        <JanelaDesenho resultado={resultado} />
      </div>

      {resultado.alertaPeso && (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
          ⚠️ {resultado.alertaPeso}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Vidros</h2>
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Peça</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Largura</th>
              <th className="py-2">Altura</th>
              <th className="py-2">Peso</th>
            </tr>
          </thead>
          <tbody>
            {resultado.paineis.map((p) => (
              <tr key={p.identificacao} className="border-b border-border last:border-0">
                <td className="py-2 font-medium text-foreground">{p.identificacao}</td>
                <td className="py-2 capitalize text-muted">{p.tipo}</td>
                <td className="py-2 text-muted">{p.larguraMm} mm</td>
                <td className="py-2 text-muted">{p.alturaMm} mm</td>
                <td className="py-2 text-muted">{p.pesoKg} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-foreground">
          Peso total: <strong>{resultado.pesoTotalKg} kg</strong>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Perfis</h2>
          <ul className="space-y-2 text-sm">
            {resultado.perfis.map((p, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-foreground">{p.descricao}</span>
                <span className="text-muted">{p.quantidade}x · {p.comprimentoMm} mm</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Acessórios</h2>
          <ul className="space-y-2 text-sm">
            {resultado.acessorios.map((a, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-foreground">{a.descricao}</span>
                <span className="text-muted">{a.quantidade}x</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <button
          type="button"
          onClick={() => setMostrarPassos((v) => !v)}
          className="text-sm font-medium text-accent-dark hover:underline"
        >
          {mostrarPassos ? "Ocultar" : "Como esse cálculo foi feito?"}
        </button>
        {mostrarPassos && (
          <ol className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-foreground">
            {resultado.passos.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold text-accent-dark">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
