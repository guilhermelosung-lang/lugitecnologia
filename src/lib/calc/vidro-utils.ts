export type TipoCalculo = "box" | "sacada" | "porta" | "janela";

export type PainelVidro = {
  larguraMm: number;
  alturaMm: number;
  espessuraMm: number;
};

function arredondar(valor: number, casas = 3) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

/**
 * Extrai a lista de vidros (largura, altura, espessura) do `resultado` json
 * de qualquer um dos 4 cálculos técnicos, para orçar o vidro pelo m². Porta
 * e janela não guardam espessura por painel no resultado — usam a coluna
 * `espessura_mm` da própria linha do cálculo, por isso é obrigatório
 * informar `espessuraMmColuna` para esses dois tipos.
 */
export function extrairPaineisDoCalculo(
  tipo: TipoCalculo,
  resultado: unknown,
  espessuraMmColuna?: number | null
): PainelVidro[] {
  const r = resultado as Record<string, unknown>;

  if (tipo === "box") {
    const vidros = (r.vidros as Record<string, number>[]) ?? [];
    return vidros.map((v) => ({ larguraMm: v.larguraMm, alturaMm: v.alturaMm, espessuraMm: v.espessuraMm }));
  }

  if (tipo === "sacada") {
    if (Array.isArray(r.segmentos)) {
      const segmentos = r.segmentos as { paineis: Record<string, number>[] }[];
      return segmentos.flatMap((s) => s.paineis).map((p) => ({
        larguraMm: p.larguraMm,
        alturaMm: p.alturaMm,
        espessuraMm: p.espessuraMm,
      }));
    }
    const paineis = (r.paineis as Record<string, number>[]) ?? [];
    return paineis.map((p) => ({ larguraMm: p.larguraMm, alturaMm: p.alturaMm, espessuraMm: p.espessuraMm }));
  }

  // porta / janela
  const paineis = (r.paineis as Record<string, number>[]) ?? [];
  const espessura = espessuraMmColuna ?? 0;
  return paineis.map((p) => ({ larguraMm: p.larguraMm, alturaMm: p.alturaMm, espessuraMm: espessura }));
}

export function areaTotalM2(paineis: PainelVidro[]): number {
  return arredondar(paineis.reduce((acc, p) => acc + (p.larguraMm / 1000) * (p.alturaMm / 1000), 0));
}

/** Espessura do cálculo — sempre uniforme entre os painéis (cada calculadora
 * usa uma única espessura de vidro por cálculo). Retorna null se não houver painel. */
export function espessuraDoCalculo(paineis: PainelVidro[]): number | null {
  return paineis.length > 0 ? paineis[0].espessuraMm : null;
}

export function precoCustoM2(preco: { preco_vidro_m2: number; preco_tempera_m2: number }): number {
  return arredondar(preco.preco_vidro_m2 + preco.preco_tempera_m2);
}

export function precoVendaM2(preco: {
  preco_vidro_m2: number;
  preco_tempera_m2: number;
  margem_padrao_percentual: number;
}): number {
  return arredondar(precoCustoM2(preco) * (1 + preco.margem_padrao_percentual / 100));
}
