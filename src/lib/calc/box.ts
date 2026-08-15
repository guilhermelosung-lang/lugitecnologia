export type BoxFrontalCorrerInput = {
  larguraSuperiorMm: number;
  larguraCentralMm: number;
  larguraInferiorMm: number;
  alturaEsquerdaMm: number;
  alturaDireitaMm: number;
  espessuraMm: number;
  ladoAbertura: "esquerda" | "direita";
};

export type ParametrosBox = {
  descontoLateralMm: number;
  transpasseMm: number;
  folgaAlturaMm: number;
  coeficientePeso: number;
};

export const PARAMETROS_BOX_PADRAO: ParametrosBox = {
  descontoLateralMm: 4,
  transpasseMm: 25,
  folgaAlturaMm: 10,
  coeficientePeso: 2.5,
};

export type VidroCalculado = {
  identificacao: string;
  tipo: "fixa" | "movel";
  larguraMm: number;
  alturaMm: number;
  espessuraMm: number;
  pesoKg: number;
};

export type ResultadoBoxFrontalCorrer = {
  larguraAdotadaMm: number;
  alturaAdotadaMm: number;
  larguraUtilMm: number;
  vidros: VidroCalculado[];
  perfis: { descricao: string; comprimentoMm: number; quantidade: number }[];
  acessorios: { descricao: string; quantidade: number }[];
  pesoTotalKg: number;
  pesoMaiorPecaKg: number;
  alertaPeso: string | null;
  parametrosUsados: ParametrosBox;
  passos: string[];
};

function arredondar(valor: number, casas = 1) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

/**
 * Calcula um box frontal de correr de 2 folhas (1 fixa + 1 móvel).
 * Fórmulas conforme especificação: largura de cada folha = (largura útil +
 * transpasse) ÷ 2. Suporte a 3+ folhas fica para uma versão futura — misturar
 * uma fórmula não verificada para outras quantidades seria pior que não ter.
 */
export function calcularBoxFrontalCorrer(
  input: BoxFrontalCorrerInput,
  parametros: ParametrosBox = PARAMETROS_BOX_PADRAO
): ResultadoBoxFrontalCorrer {
  const passos: string[] = [];

  const larguraAdotadaMm = Math.min(
    input.larguraSuperiorMm,
    input.larguraCentralMm,
    input.larguraInferiorMm
  );
  passos.push(
    `Largura adotada = menor entre superior (${input.larguraSuperiorMm} mm), central (${input.larguraCentralMm} mm) e inferior (${input.larguraInferiorMm} mm) = ${larguraAdotadaMm} mm.`
  );

  const alturaAdotadaMm = Math.min(input.alturaEsquerdaMm, input.alturaDireitaMm);
  passos.push(
    `Altura adotada = menor entre esquerda (${input.alturaEsquerdaMm} mm) e direita (${input.alturaDireitaMm} mm) = ${alturaAdotadaMm} mm.`
  );

  const larguraUtilMm = larguraAdotadaMm - parametros.descontoLateralMm * 2;
  passos.push(
    `Largura útil = largura adotada (${larguraAdotadaMm} mm) − desconto lateral do kit (${parametros.descontoLateralMm} mm × 2 lados) = ${larguraUtilMm} mm.`
  );

  const alturaVidroMm = alturaAdotadaMm - parametros.folgaAlturaMm;
  passos.push(
    `Altura do vidro = altura adotada (${alturaAdotadaMm} mm) − folga do trilho/soleira do kit (${parametros.folgaAlturaMm} mm) = ${alturaVidroMm} mm.`
  );

  const larguraCadaFolhaMm = arredondar(
    (larguraUtilMm + parametros.transpasseMm) / 2
  );
  passos.push(
    `Largura de cada folha = (largura útil (${larguraUtilMm} mm) + transpasse do kit (${parametros.transpasseMm} mm)) ÷ 2 folhas = ${larguraCadaFolhaMm} mm.`
  );

  function pesoVidro(larguraMm: number, alturaMm: number) {
    return arredondar(
      (larguraMm / 1000) * (alturaMm / 1000) * input.espessuraMm * parametros.coeficientePeso,
      2
    );
  }

  const folhaFixaPrimeiro = input.ladoAbertura === "direita";
  const vidros: VidroCalculado[] = [
    {
      identificacao: "V1",
      tipo: folhaFixaPrimeiro ? "fixa" : "movel",
      larguraMm: larguraCadaFolhaMm,
      alturaMm: alturaVidroMm,
      espessuraMm: input.espessuraMm,
      pesoKg: pesoVidro(larguraCadaFolhaMm, alturaVidroMm),
    },
    {
      identificacao: "V2",
      tipo: folhaFixaPrimeiro ? "movel" : "fixa",
      larguraMm: larguraCadaFolhaMm,
      alturaMm: alturaVidroMm,
      espessuraMm: input.espessuraMm,
      pesoKg: pesoVidro(larguraCadaFolhaMm, alturaVidroMm),
    },
  ];
  passos.push(
    `Como a abertura é pelo lado ${input.ladoAbertura}, a folha ${
      folhaFixaPrimeiro ? "V2" : "V1"
    } desliza (móvel) e a folha ${folhaFixaPrimeiro ? "V1" : "V2"} fica fixa.`
  );

  const pesoTotalKg = arredondar(
    vidros.reduce((acc, v) => acc + v.pesoKg, 0),
    2
  );
  const pesoMaiorPecaKg = arredondar(Math.max(...vidros.map((v) => v.pesoKg)), 2);
  const alertaPeso =
    pesoMaiorPecaKg > 25
      ? `A peça mais pesada tem ${pesoMaiorPecaKg} kg — acima de 25 kg, recomenda-se transporte e instalação com pelo menos 2 pessoas.`
      : null;

  const perfis = [
    { descricao: "Trilho superior", comprimentoMm: larguraAdotadaMm, quantidade: 1 },
    { descricao: "Trilho inferior", comprimentoMm: larguraAdotadaMm, quantidade: 1 },
    { descricao: "Perfil U lateral", comprimentoMm: alturaAdotadaMm, quantidade: 2 },
  ];

  const acessorios = [
    { descricao: "Roldana", quantidade: 2 },
    { descricao: "Puxador", quantidade: 1 },
    { descricao: "Batente/aparador", quantidade: 1 },
    { descricao: "Guarnição de vedação", quantidade: 1 },
  ];

  return {
    larguraAdotadaMm,
    alturaAdotadaMm,
    larguraUtilMm,
    vidros,
    perfis,
    acessorios,
    pesoTotalKg,
    pesoMaiorPecaKg,
    alertaPeso,
    parametrosUsados: parametros,
    passos,
  };
}
