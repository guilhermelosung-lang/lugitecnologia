import { PARAMETROS_SACADA_PADRAO, type ParametrosSacada } from "@/lib/calc/sacada";
import {
  calcularSegmento,
  aplicarUsinagem,
  acessoriosDoSegmento,
  perfisDoSegmento,
  type ResultadoSegmento,
} from "@/lib/calc/sacada-segmento";

export type SegmentoMedidaInput = {
  larguraMm: number;
  alturaEsquerdaMm: number;
  alturaCentralMm: number;
  alturaDireitaMm: number;
  quantidadePaineis: number;
};

export type SacadaLInput = {
  ladoA: SegmentoMedidaInput;
  ladoB: SegmentoMedidaInput;
  espessuraMm: number;
  abertura: {
    segmentoId: "A" | "B";
    lado: "esquerda" | "direita" | "central" | "bilateral";
  };
};

export type ResultadoSacadaL = {
  segmentos: [ResultadoSegmento, ResultadoSegmento];
  abertura: SacadaLInput["abertura"];
  perfilEncontroCanto: { descricao: string; comprimentoMm: number; quantidade: number };
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
 * Cortina de vidro em L: dois segmentos calculados de forma independente
 * (nunca somando os vãos), com desconto de cantoneira apenas nas pontas
 * externas que encostam na parede — o encontro entre os dois segmentos não
 * recebe desconto adicional.
 */
export function calcularSacadaL(
  input: SacadaLInput,
  parametros: ParametrosSacada = PARAMETROS_SACADA_PADRAO
): ResultadoSacadaL {
  const passosGerais: string[] = [
    "Cortina em L calculada como dois segmentos independentes (Lado A e Lado B), nunca somando os vãos em uma única reta.",
  ];

  let ladoA = calcularSegmento(
    {
      id: "A",
      rotulo: "Lado A",
      larguraMm: input.ladoA.larguraMm,
      alturaEsquerdaMm: input.ladoA.alturaEsquerdaMm,
      alturaCentralMm: input.ladoA.alturaCentralMm,
      alturaDireitaMm: input.ladoA.alturaDireitaMm,
      quantidadePaineis: input.ladoA.quantidadePaineis,
      pontaInicial: "parede",
      pontaFinal: "encontro",
    },
    parametros,
    input.espessuraMm
  );

  let ladoB = calcularSegmento(
    {
      id: "B",
      rotulo: "Lado B",
      larguraMm: input.ladoB.larguraMm,
      alturaEsquerdaMm: input.ladoB.alturaEsquerdaMm,
      alturaCentralMm: input.ladoB.alturaCentralMm,
      alturaDireitaMm: input.ladoB.alturaDireitaMm,
      quantidadePaineis: input.ladoB.quantidadePaineis,
      pontaInicial: "encontro",
      pontaFinal: "parede",
    },
    parametros,
    input.espessuraMm
  );

  const passosAbertura: string[] = [];
  if (input.abertura.lado === "esquerda" || input.abertura.lado === "direita") {
    if (input.abertura.segmentoId === "A") ladoA = aplicarUsinagem(ladoA, input.abertura.lado, parametros);
    else ladoB = aplicarUsinagem(ladoB, input.abertura.lado, parametros);
    passosAbertura.push(
      `Ponto de abertura no Lado ${input.abertura.segmentoId}, lado ${input.abertura.lado} — usinagem de saída posicionada e recolhimento para o lado ${input.abertura.lado}.`
    );
  } else {
    passosAbertura.push(
      `Ponto de abertura no Lado ${input.abertura.segmentoId} (${input.abertura.lado}) — posição exata de usinagem para abertura central/bilateral depende do projeto específico e deve ser definida manualmente com o instalador.`
    );
  }
  passosGerais.push(...passosAbertura);

  const perfilEncontroCanto = {
    descricao: "Perfil de encontro de canto (90°)",
    comprimentoMm: Math.max(ladoA.alturaVidroMm, ladoB.alturaVidroMm),
    quantidade: 1,
  };
  passosGerais.push(
    "Cálculo assume encontro de canto em 90°. Ângulos diferentes ainda não alteram a fórmula — confira com a ficha técnica do kit se o projeto exigir um encontro específico."
  );

  const perfis = [...perfisDoSegmento(ladoA), ...perfisDoSegmento(ladoB), perfilEncontroCanto];
  const acessorios = [
    ...acessoriosDoSegmento(ladoA),
    ...acessoriosDoSegmento(ladoB),
    { descricao: "Pivotante (ponto de abertura)", quantidade: 1 },
    { descricao: "Fechadura", quantidade: 1 },
    { descricao: "Aparador", quantidade: 1 },
  ];

  const segmentos: [ResultadoSegmento, ResultadoSegmento] = [ladoA, ladoB];
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
    perfilEncontroCanto,
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
