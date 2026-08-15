/**
 * Plano de corte de vidro: empacotamento 2D das peças dentro de chapas de
 * um tamanho fixo, usando o algoritmo de prateleiras (shelf packing) —
 * ordena as peças da mais alta pra mais baixa e vai enchendo "prateleiras"
 * horizontais dentro da largura da chapa, abrindo uma nova chapa quando a
 * altura acaba. É uma heurística conhecida de bin-packing 2D (não é uma
 * fórmula do setor de vidro — é geometria pura), então não corre o risco de
 * inventar uma regra de negócio não verificada.
 */

export type PecaVidro = {
  codigo: string;
  larguraMm: number;
  alturaMm: number;
  quantidade: number;
};

export type PecaPosicionada = {
  codigo: string;
  x: number;
  y: number;
  larguraMm: number;
  alturaMm: number;
};

export type ChapaResultado = {
  numero: number;
  pecas: PecaPosicionada[];
  areaUsadaM2: number;
  aproveitamentoPercentual: number;
};

export type ResultadoPlanoCorteVidro = {
  chapaLarguraMm: number;
  chapaAlturaMm: number;
  margemMm: number;
  chapas: ChapaResultado[];
  totalChapas: number;
  totalPecas: number;
  areaTotalPecasM2: number;
  areaTotalChapasM2: number;
  aproveitamentoMedioPercentual: number;
  pecasQueNaoCoube: string[];
};

function arredondar(valor: number, casas = 2) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

export function calcularPlanoCorteVidro(
  pecas: PecaVidro[],
  chapaLarguraMm: number,
  chapaAlturaMm: number,
  margemMm: number
): ResultadoPlanoCorteVidro {
  // Expande quantidade em unidades individuais e ordena da mais alta pra mais baixa.
  const unidades: { codigo: string; larguraMm: number; alturaMm: number }[] = [];
  for (const p of pecas) {
    for (let i = 0; i < p.quantidade; i++) {
      unidades.push({ codigo: p.quantidade > 1 ? `${p.codigo}.${i + 1}` : p.codigo, larguraMm: p.larguraMm, alturaMm: p.alturaMm });
    }
  }
  unidades.sort((a, b) => b.alturaMm - a.alturaMm);

  const pecasQueNaoCoube: string[] = [];
  const chapas: ChapaResultado[] = [];

  let chapaAtual: PecaPosicionada[] = [];
  let prateleiraY = 0;
  let prateleiraAltura = 0;
  let cursorX = 0;

  function fecharChapa() {
    if (chapaAtual.length === 0) return;
    const areaUsada = chapaAtual.reduce((acc, p) => acc + (p.larguraMm / 1000) * (p.alturaMm / 1000), 0);
    const areaChapa = (chapaLarguraMm / 1000) * (chapaAlturaMm / 1000);
    chapas.push({
      numero: chapas.length + 1,
      pecas: chapaAtual,
      areaUsadaM2: arredondar(areaUsada),
      aproveitamentoPercentual: arredondar((areaUsada / areaChapa) * 100, 1),
    });
    chapaAtual = [];
    prateleiraY = 0;
    prateleiraAltura = 0;
    cursorX = 0;
  }

  for (const peca of unidades) {
    if (peca.larguraMm > chapaLarguraMm || peca.alturaMm > chapaAlturaMm) {
      pecasQueNaoCoube.push(peca.codigo);
      continue;
    }

    // Cabe na prateleira atual?
    if (cursorX + peca.larguraMm > chapaLarguraMm) {
      // Nova prateleira dentro da mesma chapa
      prateleiraY += prateleiraAltura + margemMm;
      prateleiraAltura = 0;
      cursorX = 0;
    }

    // Cabe na chapa (altura) atual?
    if (prateleiraY + peca.alturaMm > chapaAlturaMm) {
      fecharChapa();
    }

    chapaAtual.push({ codigo: peca.codigo, x: cursorX, y: prateleiraY, larguraMm: peca.larguraMm, alturaMm: peca.alturaMm });
    cursorX += peca.larguraMm + margemMm;
    prateleiraAltura = Math.max(prateleiraAltura, peca.alturaMm);
  }
  fecharChapa();

  // Só as peças que couberam entram nessa conta — uma peça rejeitada não
  // ocupou chapa nenhuma, então não pode contar como "aproveitamento".
  const areaTotalPecasM2 = arredondar(
    chapas.reduce((acc, c) => acc + c.pecas.reduce((a, p) => a + (p.larguraMm / 1000) * (p.alturaMm / 1000), 0), 0)
  );
  const areaTotalChapasM2 = arredondar(chapas.length * (chapaLarguraMm / 1000) * (chapaAlturaMm / 1000));
  const aproveitamentoMedioPercentual = areaTotalChapasM2 > 0 ? arredondar((areaTotalPecasM2 / areaTotalChapasM2) * 100, 1) : 0;

  return {
    chapaLarguraMm,
    chapaAlturaMm,
    margemMm,
    chapas,
    totalChapas: chapas.length,
    totalPecas: unidades.length,
    areaTotalPecasM2,
    areaTotalChapasM2,
    aproveitamentoMedioPercentual,
    pecasQueNaoCoube,
  };
}
