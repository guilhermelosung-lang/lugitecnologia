"use client";

import { useState } from "react";
import type { ResultadoSacadaU } from "@/lib/calc/sacada-u";
import { SacadaUDesenho } from "@/components/calculadoras/sacada-u-desenho";
import { SegmentoResultadoCard } from "@/components/calculadoras/segmento-resultado-card";

export function SacadaUResultado({ resultado }: { resultado: ResultadoSacadaU }) {
  const [mostrarPassos, setMostrarPassos] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Desenho em planta</h2>
        <SacadaUDesenho resultado={resultado} />
      </div>

      {!resultado.prontoParaTempera && (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-foreground">
          <p className="font-medium">🚫 Pedido para têmpera bloqueado — resolva antes de prosseguir:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {resultado.motivosBloqueio.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      {resultado.alertaPeso && (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
          ⚠️ {resultado.alertaPeso}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {resultado.segmentos.map((s) => (
          <SegmentoResultadoCard key={s.id} segmento={s} />
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Resumo geral</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-4">
          <p>Total de vidros: <strong className="text-primary">{resultado.totalVidros}</strong></p>
          <p>Área total: <strong className="text-primary">{resultado.areaTotalM2} m²</strong></p>
          <p>Peso total: <strong className="text-primary">{resultado.pesoTotalKg} kg</strong></p>
          <p>Peça mais pesada: <strong className="text-primary">{resultado.pesoMaiorPecaKg} kg</strong></p>
        </div>
        <p className="mt-3 text-xs text-muted">
          Abertura no segmento {resultado.abertura.segmentoId}, lado {resultado.abertura.lado}.
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
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Lista para têmpera</h2>
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Código</th>
              <th className="py-2">Segmento</th>
              <th className="py-2">Largura</th>
              <th className="py-2">Altura</th>
              <th className="py-2">Espessura</th>
              <th className="py-2">Observação</th>
            </tr>
          </thead>
          <tbody>
            {resultado.listaTempera.map((item) => (
              <tr key={item.codigo} className="border-b border-border last:border-0">
                <td className="py-2 font-medium text-foreground">{item.codigo}</td>
                <td className="py-2 text-muted">{item.segmento}</td>
                <td className="py-2 text-muted">{item.larguraMm} mm</td>
                <td className="py-2 text-muted">{item.alturaMm} mm</td>
                <td className="py-2 text-muted">{item.espessuraMm} mm</td>
                <td className="py-2 text-muted">{item.observacao || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
            {[...resultado.passosGerais, ...resultado.segmentos.flatMap((s) => s.passos)].map((p, i) => (
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
