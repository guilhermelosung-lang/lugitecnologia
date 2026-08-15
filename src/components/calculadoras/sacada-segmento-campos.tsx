"use client";

import { useState } from "react";
import { sugerirAlternativasSegmento, type PontaTipo } from "@/lib/calc/sacada-segmento";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Campos de medida de um segmento (usado por L e U), com sugestão de
 * quantidade de painéis calculada ao vivo — recomendada, com menos vidros
 * e com mais vidros — a partir da largura já com os descontos de ponta. */
export function SegmentoCampos({
  prefixo,
  rotulo,
  pontaInicial,
  pontaFinal,
}: {
  prefixo: string;
  rotulo: string;
  pontaInicial: PontaTipo;
  pontaFinal: PontaTipo;
}) {
  const [larguraMm, setLarguraMm] = useState<number | "">("");
  const [quantidade, setQuantidade] = useState<number | "">("");

  const alternativas =
    typeof larguraMm === "number" && larguraMm > 0
      ? sugerirAlternativasSegmento(larguraMm, pontaInicial, pontaFinal)
      : null;

  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-primary">{rotulo}</h4>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${prefixo}_largura_mm`}>Largura do vão (mm)</Label>
          <Input
            id={`${prefixo}_largura_mm`}
            name={`${prefixo}_largura_mm`}
            type="number"
            step="1"
            min={1}
            required
            className="mt-1.5"
            onChange={(e) => setLarguraMm(e.target.value ? Number(e.target.value) : "")}
          />
        </div>
        <div>
          <Label htmlFor={`${prefixo}_quantidade_paineis`}>
            Quantidade de painéis
            {alternativas?.recomendada && (
              <span className="text-accent-dark"> (sugestão: {alternativas.recomendada.quantidade})</span>
            )}
          </Label>
          <Input
            id={`${prefixo}_quantidade_paineis`}
            name={`${prefixo}_quantidade_paineis`}
            type="number"
            step="1"
            min={1}
            required
            value={quantidade}
            placeholder={alternativas?.recomendada ? String(alternativas.recomendada.quantidade) : undefined}
            onChange={(e) => setQuantidade(e.target.value ? Number(e.target.value) : "")}
            className="mt-1.5"
          />
        </div>
      </div>

      {alternativas && (
        <div className="mt-2 flex flex-wrap gap-2">
          {alternativas.recomendada && (
            <button
              type="button"
              onClick={() => setQuantidade(alternativas.recomendada!.quantidade)}
              className="rounded-full border border-accent-dark/40 bg-accent-dark/10 px-3 py-1 text-xs font-medium text-accent-dark hover:bg-accent-dark/20"
            >
              Recomendado: {alternativas.recomendada.quantidade}x de {alternativas.recomendada.larguraVidroMm}mm
            </button>
          )}
          {alternativas.menosVidros && (
            <button
              type="button"
              onClick={() => setQuantidade(alternativas.menosVidros!.quantidade)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:bg-surface"
            >
              Menos vidros: {alternativas.menosVidros.quantidade}x de {alternativas.menosVidros.larguraVidroMm}mm
            </button>
          )}
          {alternativas.maisVidros && (
            <button
              type="button"
              onClick={() => setQuantidade(alternativas.maisVidros!.quantidade)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:bg-surface"
            >
              Mais vidros: {alternativas.maisVidros.quantidade}x de {alternativas.maisVidros.larguraVidroMm}mm
            </button>
          )}
          {!alternativas.recomendada?.dentroFaixa && (
            <span className="text-xs text-warning">
              Nenhuma quantidade testada deixa o vidro entre 450–600mm — confira manualmente.
            </span>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor={`${prefixo}_altura_esquerda_mm`}>Altura esquerda (mm)</Label>
          <Input id={`${prefixo}_altura_esquerda_mm`} name={`${prefixo}_altura_esquerda_mm`} type="number" step="1" min={1} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`${prefixo}_altura_central_mm`}>Altura central (mm)</Label>
          <Input id={`${prefixo}_altura_central_mm`} name={`${prefixo}_altura_central_mm`} type="number" step="1" min={1} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`${prefixo}_altura_direita_mm`}>Altura direita (mm)</Label>
          <Input id={`${prefixo}_altura_direita_mm`} name={`${prefixo}_altura_direita_mm`} type="number" step="1" min={1} required className="mt-1.5" />
        </div>
      </div>
    </div>
  );
}
