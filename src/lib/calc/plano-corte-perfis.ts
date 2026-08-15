/**
 * Plano de corte de perfis: empacotamento 1D das peças dentro de barras de
 * comprimento fixo, usando a heurística First-Fit-Decreasing (FFD) — ordena
 * as peças da mais comprida pra mais curta e encaixa cada uma na primeira
 * barra aberta que ainda tem espaço, abrindo uma nova barra quando
 * necessário. É um algoritmo clássico de bin-packing 1D (geometria pura,
 * não uma regra de negócio do setor).
 */

export type PecaPerfil = {
  codigo: string;
  comprimentoMm: number;
  quantidade: number;
};

export type CortePosicionado = {
  codigo: string;
  comprimentoMm: number;
};

export type BarraResultado = {
  numero: number;
  cortes: CortePosicionado[];
  sobraMm: number;
  aproveitamentoPercentual: number;
};

export type ResultadoPlanoCortePerfis = {
  comprimentoBarraMm: number;
  margemMm: number;
  barras: BarraResultado[];
  totalBarras: number;
  totalCortes: number;
  comprimentoTotalCortesMm: number;
  comprimentoTotalBarrasMm: number;
  aproveitamentoMedioPercentual: number;
  pecasQueNaoCoube: string[];
};

function arredondar(valor: number, casas = 2) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

export function calcularPlanoCortePerfis(
  pecas: PecaPerfil[],
  comprimentoBarraMm: number,
  margemMm: number
): ResultadoPlanoCortePerfis {
  const unidades: { codigo: string; comprimentoMm: number }[] = [];
  for (const p of pecas) {
    for (let i = 0; i < p.quantidade; i++) {
      unidades.push({ codigo: p.quantidade > 1 ? `${p.codigo}.${i + 1}` : p.codigo, comprimentoMm: p.comprimentoMm });
    }
  }
  unidades.sort((a, b) => b.comprimentoMm - a.comprimentoMm);

  const pecasQueNaoCoube: string[] = [];
  const barrasAbertas: { cortes: CortePosicionado[]; usadoMm: number }[] = [];

  for (const peca of unidades) {
    if (peca.comprimentoMm > comprimentoBarraMm) {
      pecasQueNaoCoube.push(peca.codigo);
      continue;
    }

    const barra = barrasAbertas.find((b) => b.usadoMm + (b.cortes.length > 0 ? margemMm : 0) + peca.comprimentoMm <= comprimentoBarraMm);
    if (barra) {
      barra.usadoMm += (barra.cortes.length > 0 ? margemMm : 0) + peca.comprimentoMm;
      barra.cortes.push({ codigo: peca.codigo, comprimentoMm: peca.comprimentoMm });
    } else {
      barrasAbertas.push({ cortes: [{ codigo: peca.codigo, comprimentoMm: peca.comprimentoMm }], usadoMm: peca.comprimentoMm });
    }
  }

  const barras: BarraResultado[] = barrasAbertas.map((b, i) => ({
    numero: i + 1,
    cortes: b.cortes,
    sobraMm: arredondar(comprimentoBarraMm - b.usadoMm),
    aproveitamentoPercentual: arredondar((b.usadoMm / comprimentoBarraMm) * 100, 1),
  }));

  // Só os cortes que couberam numa barra entram nessa conta — uma peça
  // rejeitada não ocupou barra nenhuma, então não pode contar como
  // "aproveitamento".
  const comprimentoTotalCortesMm = barras.reduce(
    (acc, b) => acc + b.cortes.reduce((a, c) => a + c.comprimentoMm, 0),
    0
  );
  const comprimentoTotalBarrasMm = barras.length * comprimentoBarraMm;
  const aproveitamentoMedioPercentual =
    comprimentoTotalBarrasMm > 0 ? arredondar((comprimentoTotalCortesMm / comprimentoTotalBarrasMm) * 100, 1) : 0;

  return {
    comprimentoBarraMm,
    margemMm,
    barras,
    totalBarras: barras.length,
    totalCortes: unidades.length,
    comprimentoTotalCortesMm,
    comprimentoTotalBarrasMm,
    aproveitamentoMedioPercentual,
    pecasQueNaoCoube,
  };
}
