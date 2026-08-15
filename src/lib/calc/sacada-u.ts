import { PARAMETROS_SACADA_PADRAO, type ParametrosSacada } from "@/lib/calc/sacada";
import {
  calcularSegmento,
  aplicarUsinagem,
  acessoriosDoSegmento,
  perfisDoSegmento,
  type ResultadoSegmento,
} from "@/lib/calc/sacada-segmento";
import type { SegmentoMedidaInput } from "@/lib/calc/sacada-l";

export type SacadaUInput = {
  ladoEsquerdo: SegmentoMedidaInput;
  frente: SegmentoMedidaInput;
  ladoDireito: SegmentoMedidaInput;
  espessuraMm: number;
  abertura: {
    segmentoId: "esquerdo" | "frente" | "direito";
    lado: "esquerda" | "direita" | "central" | "bilateral";
  };
};

export type ResultadoSacadaU = {
  segmentos: [ResultadoSegmento, ResultadoSegmento, ResultadoSegmento];
  abertura: SacadaUInput["abertura"];
  perfisEncontroCanto: { descricao: string; comprimentoMm: number; quantidade: number }[];
  perfis: { descricao: string; comprimentoMm: number; quantidade: number }[];
  acessorios: { descricao: string; quantidade: number }[];
  totalVidros: number;
  areaTotalM2: number;
  pesoTotalKg: number;
  pesoMaiorPecaKg: number;
  alertaPeso: string | null;
  listaTempera: {
    codigo: string;
    segmento: string;
    larguraMm: number;
    alturaMm: number;
    quantidade: number;
    espessuraMm: number;
    observacao: string;
  }[];
  prontoParaTempera: boolean;
  motivosBloqueio: string[];
  parametrosUsados: ParametrosSacada;
  passosGerais: string[];
};

function arredondar(valor: number, casas = 2) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

/**
 * Cortina de vidro em U: três segmentos (lado esquerdo, frente, lado
 * direito) sempre calculados individualmente. Só as duas extremidades
 * externas (que encostam na parede) recebem o desconto de cantoneira — os
 * dois encontros internos (esquerdo-frente e frente-direito) não recebem
 * desconto adicional, salvo regra própria de um kit específico.
 */
export function calcularSacadaU(
  input: SacadaUInput,
  parametros: ParametrosSacada = PARAMETROS_SACADA_PADRAO
): ResultadoSacadaU {
  const passosGerais: string[] = [
    "Cortina em U calculada como três segmentos independentes (Esquerdo, Frente, Direito), nunca somando os três vãos em uma única reta.",
  ];

  let esquerdo = calcularSegmento(
    {
      id: "E",
      rotulo: "Lado Esquerdo",
      larguraMm: input.ladoEsquerdo.larguraMm,
      alturaEsquerdaMm: input.ladoEsquerdo.alturaEsquerdaMm,
      alturaCentralMm: input.ladoEsquerdo.alturaCentralMm,
      alturaDireitaMm: input.ladoEsquerdo.alturaDireitaMm,
      quantidadePaineis: input.ladoEsquerdo.quantidadePaineis,
      pontaInicial: "parede",
      pontaFinal: "encontro",
    },
    parametros,
    input.espessuraMm
  );

  let frente = calcularSegmento(
    {
      id: "F",
      rotulo: "Frente",
      larguraMm: input.frente.larguraMm,
      alturaEsquerdaMm: input.frente.alturaEsquerdaMm,
      alturaCentralMm: input.frente.alturaCentralMm,
      alturaDireitaMm: input.frente.alturaDireitaMm,
      quantidadePaineis: input.frente.quantidadePaineis,
      pontaInicial: "encontro",
      pontaFinal: "encontro",
    },
    parametros,
    input.espessuraMm
  );

  let direito = calcularSegmento(
    {
      id: "D",
      rotulo: "Lado Direito",
      larguraMm: input.ladoDireito.larguraMm,
      alturaEsquerdaMm: input.ladoDireito.alturaEsquerdaMm,
      alturaCentralMm: input.ladoDireito.alturaCentralMm,
      alturaDireitaMm: input.ladoDireito.alturaDireitaMm,
      quantidadePaineis: input.ladoDireito.quantidadePaineis,
      pontaInicial: "encontro",
      pontaFinal: "parede",
    },
    parametros,
    input.espessuraMm
  );

  const passosAbertura: string[] = [];
  if (input.abertura.lado === "esquerda" || input.abertura.lado === "direita") {
    if (input.abertura.segmentoId === "esquerdo") esquerdo = aplicarUsinagem(esquerdo, input.abertura.lado, parametros);
    else if (input.abertura.segmentoId === "frente") frente = aplicarUsinagem(frente, input.abertura.lado, parametros);
    else direito = aplicarUsinagem(direito, input.abertura.lado, parametros);
    passosAbertura.push(
      `Ponto de abertura no segmento ${input.abertura.segmentoId}, lado ${input.abertura.lado} — usinagem de saída posicionada e recolhimento para o lado ${input.abertura.lado}.`
    );
  } else {
    passosAbertura.push(
      `Ponto de abertura no segmento ${input.abertura.segmentoId} (${input.abertura.lado}) — posição exata de usinagem para abertura central/bilateral depende do projeto específico e deve ser definida manualmente com o instalador.`
    );
  }
  passosGerais.push(...passosAbertura);

  const perfisEncontroCanto = [
    { descricao: "Perfil de encontro de canto (90°) — Esquerdo/Frente", comprimentoMm: Math.max(esquerdo.alturaVidroMm, frente.alturaVidroMm), quantidade: 1 },
    { descricao: "Perfil de encontro de canto (90°) — Frente/Direito", comprimentoMm: Math.max(frente.alturaVidroMm, direito.alturaVidroMm), quantidade: 1 },
  ];
  passosGerais.push(
    "Cálculo assume os dois encontros de canto em 90°. Ângulos diferentes ainda não alteram a fórmula — confira com a ficha técnica do kit se o projeto exigir um encontro específico."
  );

  const perfis = [
    ...perfisDoSegmento(esquerdo),
    ...perfisDoSegmento(frente),
    ...perfisDoSegmento(direito),
    ...perfisEncontroCanto,
  ];
  const acessorios = [
    ...acessoriosDoSegmento(esquerdo),
    ...acessoriosDoSegmento(frente),
    ...acessoriosDoSegmento(direito),
    { descricao: "Pivotante (ponto de abertura)", quantidade: 1 },
    { descricao: "Fechadura", quantidade: 1 },
    { descricao: "Aparador", quantidade: 1 },
  ];

  const segmentos: [ResultadoSegmento, ResultadoSegmento, ResultadoSegmento] = [esquerdo, frente, direito];
  const totalVidros = segmentos.reduce((acc, s) => acc + s.paineis.length, 0);
  const areaTotalM2 = arredondar(
    segmentos.reduce(
      (acc, s) => acc + s.paineis.reduce((a, p) => a + (p.larguraMm / 1000) * (p.alturaMm / 1000), 0),
      0
    )
  );
  const pesoTotalKg = arredondar(segmentos.reduce((acc, s) => acc + s.pesoTotalKg, 0));
  const pesoMaiorPecaKg = arredondar(Math.max(...segmentos.map((s) => s.pesoMaiorPecaKg)));
  const alertaPeso =
    pesoMaiorPecaKg > 25
      ? `A peça mais pesada tem ${pesoMaiorPecaKg} kg — acima de 25 kg, recomenda-se transporte e instalação com pelo menos 2 pessoas.`
      : null;

  const listaTempera = segmentos.flatMap((s) =>
    s.paineis.map((p) => ({
      codigo: p.codigo,
      segmento: s.rotulo,
      larguraMm: p.larguraMm,
      alturaMm: p.alturaMm,
      quantidade: 1,
      espessuraMm: p.espessuraMm,
      observacao: p.usinagem ? `Usinagem ${p.usinagem.lado} em ${p.usinagem.posicaoMm} mm` : "",
    }))
  );

  const motivosBloqueio: string[] = [];
  for (const s of segmentos) {
    if (s.criterioAltura === "media") motivosBloqueio.push(`${s.rotulo}: diferença de altura acima de 30 mm — confirme a medição.`);
    if (s.conferencia.status === "vermelho") motivosBloqueio.push(`${s.rotulo}: conferência inversa não fechou — revisar projeto.`);
    if (s.larguraVidroMm <= 0 || s.alturaVidroMm <= 0) motivosBloqueio.push(`${s.rotulo}: medida final igual ou menor que zero.`);
  }

  return {
    segmentos,
    abertura: input.abertura,
    perfisEncontroCanto,
    perfis,
    acessorios,
    totalVidros,
    areaTotalM2,
    pesoTotalKg,
    pesoMaiorPecaKg,
    alertaPeso,
    listaTempera,
    prontoParaTempera: motivosBloqueio.length === 0,
    motivosBloqueio,
    parametrosUsados: parametros,
    passosGerais,
  };
}
