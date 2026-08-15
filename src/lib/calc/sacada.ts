export type SacadaRetaInput = {
  larguraTotalMm: number;
  alturaEsquerdaMm: number;
  alturaCentralMm: number;
  alturaDireitaMm: number;
  quantidadePaineis: number;
  espessuraMm: number;
  ladoAbertura: "esquerda" | "direita" | "central";
};

export type ParametrosSacada = {
  descontoCantoneiraMm: number;
  descontoGuarnicaoMm: number;
  descontoAlturaMm: number;
  descontoLeitoMm: number;
  usinagemRecuoMm: number;
  usinagemComprimentoMm: number;
  coeficientePeso: number;
};

export const PARAMETROS_SACADA_PADRAO: ParametrosSacada = {
  descontoCantoneiraMm: 10,
  descontoGuarnicaoMm: 3,
  descontoAlturaMm: 165,
  descontoLeitoMm: 2,
  usinagemRecuoMm: 20,
  usinagemComprimentoMm: 30,
  coeficientePeso: 2.5,
};

export type PainelCalculado = {
  identificacao: string;
  larguraMm: number;
  alturaMm: number;
  espessuraMm: number;
  comprimentoLeitoMm: number;
  posicaoUsinagemMm: number;
  pesoKg: number;
};

export type ResultadoSacadaReta = {
  quantidadePaineis: number;
  larguraUtilMm: number;
  larguraVidroMm: number;
  alturaAdotadaMm: number;
  diferencaAlturaMm: number;
  alertaAltura: string | null;
  paineis: PainelCalculado[];
  perfis: { descricao: string; comprimentoMm: number; quantidade: number }[];
  acessorios: { descricao: string; quantidade: number }[];
  pesoTotalKg: number;
  pesoMaiorPecaKg: number;
  alertaPeso: string | null;
  parametrosUsados: ParametrosSacada;
  passos: string[];
};

function arredondar(valor: number, casas = 1) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

/** Sugere a quantidade de painéis mantendo cada um preferencialmente entre
 * 450 e 600 mm, começando pela regra largura ÷ 500 mm. */
export function sugerirQuantidadePaineis(larguraTotalMm: number): number {
  let qtd = Math.max(1, Math.round(larguraTotalMm / 500));
  while (larguraTotalMm / qtd > 600) qtd += 1;
  while (qtd > 1 && larguraTotalMm / qtd < 450) qtd -= 1;
  return qtd;
}

/**
 * Calcula um envidraçamento de sacada reta sem roldanas. Suporte a L, U e
 * segmentos múltiplos fica para uma versão futura — aplicar a fórmula da
 * sacada reta a esses formatos sem verificação seria pior que não calcular.
 */
export function calcularSacadaReta(
  input: SacadaRetaInput,
  parametros: ParametrosSacada = PARAMETROS_SACADA_PADRAO
): ResultadoSacadaReta {
  const passos: string[] = [];

  const larguraUtilMm = input.larguraTotalMm - parametros.descontoCantoneiraMm * 2;
  passos.push(
    `Largura útil = largura total (${input.larguraTotalMm} mm) − cantoneiras nas duas extremidades (${parametros.descontoCantoneiraMm} mm × 2) = ${larguraUtilMm} mm.`
  );

  const larguraBaseMm = arredondar(larguraUtilMm / input.quantidadePaineis);
  passos.push(
    `Largura base de cada painel = largura útil (${larguraUtilMm} mm) ÷ ${input.quantidadePaineis} painéis = ${larguraBaseMm} mm.`
  );

  const larguraVidroMm = arredondar(larguraBaseMm - parametros.descontoGuarnicaoMm);
  passos.push(
    `Largura do vidro = largura base (${larguraBaseMm} mm) − guarnição do kit (${parametros.descontoGuarnicaoMm} mm) = ${larguraVidroMm} mm.`
  );

  const alturas = [input.alturaEsquerdaMm, input.alturaCentralMm, input.alturaDireitaMm];
  const alturaMenor = Math.min(...alturas);
  const alturaMaior = Math.max(...alturas);
  const alturaMedia = arredondar((input.alturaEsquerdaMm + input.alturaCentralMm + input.alturaDireitaMm) / 3);
  const diferencaAlturaMm = arredondar(alturaMaior - alturaMenor);
  const usarMedia = diferencaAlturaMm > 30;
  const alturaAdotadaMm = usarMedia ? alturaMedia : alturaMenor;
  const alertaAltura = usarMedia
    ? `Diferença de ${diferencaAlturaMm} mm entre as alturas medidas — acima da tolerância de 30 mm. Foi usada a média (${alturaMedia} mm) como referência. Confirme a medição antes de liberar para têmpera.`
    : null;
  passos.push(
    usarMedia
      ? `Altura adotada = média das três medidas (${input.alturaEsquerdaMm} / ${input.alturaCentralMm} / ${input.alturaDireitaMm} mm) = ${alturaMedia} mm, pois a diferença (${diferencaAlturaMm} mm) passou de 30 mm.`
      : `Altura adotada = menor entre as três medidas (${input.alturaEsquerdaMm} / ${input.alturaCentralMm} / ${input.alturaDireitaMm} mm) = ${alturaMenor} mm, por segurança.`
  );

  const alturaVidroMm = arredondar(alturaAdotadaMm - parametros.descontoAlturaMm);
  passos.push(
    `Altura do vidro = altura adotada (${alturaAdotadaMm} mm) − desconto de trilho superior/inferior do kit (${parametros.descontoAlturaMm} mm) = ${alturaVidroMm} mm.`
  );

  const comprimentoLeitoMm = arredondar(larguraVidroMm - parametros.descontoLeitoMm);
  const posicaoUsinagemMm = arredondar(larguraVidroMm - parametros.usinagemRecuoMm);
  passos.push(
    `Leito de colagem = largura do vidro (${larguraVidroMm} mm) − ${parametros.descontoLeitoMm} mm = ${comprimentoLeitoMm} mm.`
  );
  passos.push(
    `Posição de referência da usinagem de saída = largura do vidro (${larguraVidroMm} mm) − ${parametros.usinagemRecuoMm} mm = ${posicaoUsinagemMm} mm.`
  );

  function pesoVidro(larguraMm: number, alturaMm: number) {
    return arredondar(
      (larguraMm / 1000) * (alturaMm / 1000) * input.espessuraMm * parametros.coeficientePeso,
      2
    );
  }

  const paineis: PainelCalculado[] = Array.from({ length: input.quantidadePaineis }, (_, i) => ({
    identificacao: `V${i + 1}`,
    larguraMm: larguraVidroMm,
    alturaMm: alturaVidroMm,
    espessuraMm: input.espessuraMm,
    comprimentoLeitoMm,
    posicaoUsinagemMm,
    pesoKg: pesoVidro(larguraVidroMm, alturaVidroMm),
  }));
  passos.push(
    `Considerando todos os ${input.quantidadePaineis} painéis deslizantes (típico de sacada reta sem roldanas), com abertura pelo lado ${input.ladoAbertura}.`
  );

  const pesoTotalKg = arredondar(paineis.reduce((acc, p) => acc + p.pesoKg, 0), 2);
  const pesoMaiorPecaKg = arredondar(Math.max(...paineis.map((p) => p.pesoKg)), 2);
  const alertaPeso =
    pesoMaiorPecaKg > 25
      ? `A peça mais pesada tem ${pesoMaiorPecaKg} kg — acima de 25 kg, recomenda-se transporte e instalação com pelo menos 2 pessoas.`
      : null;

  const perfis = [
    { descricao: "Perfil U superior", comprimentoMm: input.larguraTotalMm, quantidade: 1 },
    { descricao: "Perfil U inferior", comprimentoMm: input.larguraTotalMm, quantidade: 1 },
    { descricao: "Cantoneira", comprimentoMm: alturaVidroMm, quantidade: 2 },
  ];

  const acessorios = [
    { descricao: "Deslizante (superior + inferior por painel)", quantidade: input.quantidadePaineis * 2 },
    { descricao: "Pivotante (ponto de abertura)", quantidade: 1 },
    { descricao: "Estacionamento", quantidade: input.quantidadePaineis },
    { descricao: "Tampa de leito", quantidade: input.quantidadePaineis * 2 },
    { descricao: "Guarnição de vedação", quantidade: input.quantidadePaineis },
    { descricao: "Escova", quantidade: input.quantidadePaineis },
    { descricao: "Fechadura", quantidade: 1 },
    { descricao: "Aparador", quantidade: 1 },
  ];

  return {
    quantidadePaineis: input.quantidadePaineis,
    larguraUtilMm,
    larguraVidroMm,
    alturaAdotadaMm,
    diferencaAlturaMm,
    alertaAltura,
    paineis,
    perfis,
    acessorios,
    pesoTotalKg,
    pesoMaiorPecaKg,
    alertaPeso,
    parametrosUsados: parametros,
    passos,
  };
}
