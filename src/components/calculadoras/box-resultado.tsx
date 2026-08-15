"use client";

import { useState } from "react";
import type { ResultadoBoxFrontalCorrer } from "@/lib/calc/box";
import { BoxDesenho } from "@/components/calculadoras/box-desenho";

export function BoxResultado({ resultado }: { resultado: ResultadoBoxFrontalCorrer }) {
  const [mostrarPassos, setMostrarPassos] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Desenho técnico</h2>
        <BoxDesenho resultado={resultado} />
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
              <th className="py-2">Espessura</th>
              <th className="py-2">Peso</th>
            </tr>
          </thead>
          <tbody>
            {resultado.vidros.map((v) => (
              <tr key={v.identificacao} className="border-b border-border last:border-0">
                <td className="py-2 font-medium text-foreground">{v.identificacao}</td>
                <td className="py-2 capitalize text-muted">{v.tipo}</td>
                <td className="py-2 text-muted">{v.larguraMm} mm</td>
                <td className="py-2 text-muted">{v.alturaMm} mm</td>
                <td className="py-2 text-muted">{v.espessuraMm} mm</td>
                <td className="py-2 text-muted">{v.pesoKg} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-foreground">
          Peso total: <strong>{resultado.pesoTotalKg} kg</strong> · Peça mais pesada:{" "}
          <strong>{resultado.pesoMaiorPecaKg} kg</strong>
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
