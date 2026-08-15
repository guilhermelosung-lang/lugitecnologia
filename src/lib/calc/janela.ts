export type TipoJanela = "fixa" | "correr";

export type JanelaInput = {
  tipoJanela: TipoJanela;
  larguraVaoMm: number;
  alturaVaoMm: number;
  espessuraMm: number;
};

export type ParametrosJanela = {
  descontoLateralMm: number;
  descontoAlturaMm: number;
  transpasseMm: number;
  coeficientePeso: number;
};

export const PARAMETROS_JANELA_PADRAO: ParametrosJanela = {
  descontoLateralMm: 4,
  descontoAlturaMm: 8,
  transpasseMm: 25,
  coeficientePeso: 2.5,
};

export type PainelJanela = {
  identificacao: string;
  tipo: "fixa" | "movel";
  larguraMm: number;
  alturaMm: number;
  pesoKg: number;
};

export type ResultadoJanela = {
  tipoJanela: TipoJanela;
  paineis: PainelJanela[];
  perfis: { descricao: string; comprimentoMm: number; quantidade: number }[];
  acessorios: { descricao: string; quantidade: number }[];
  pesoTotalKg: number;
  pesoMaiorPecaKg: number;
  alertaPeso: string | null;
  parametrosUsados: ParametrosJanela;
  passos: string[];
};

function arredondar(valor: number, casas = 1) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

function pesoVidro(larguraMm: number, alturaMm: number, espessuraMm: number, coeficiente: number) {
  return arredondar((larguraMm / 1000) * (alturaMm / 1000) * espessuraMm * coeficiente, 2);
}

function finalizar(
  tipoJanela: TipoJanela,
  paineis: PainelJanela[],
  perfis: { descricao: string; comprimentoMm: number; quantidade: number }[],
  acessorios: { descricao: string; quantidade: number }[],
  parametros: ParametrosJanela,
  passos: string[]
): ResultadoJanela {
  const pesoTotalKg = arredondar(paineis.reduce((acc, p) => acc + p.pesoKg, 0), 2);
  const pesoMaiorPecaKg = arredondar(Math.max(...paineis.map((p) => p.pesoKg)), 2);
  const alertaPeso =
    pesoMaiorPecaKg > 25
      ? `A peça mais pesada tem ${pesoMaiorPecaKg} kg — acima de 25 kg, use pelo menos 2 instaladores.`
      : null;
  return { tipoJanela, paineis, perfis, acessorios, pesoTotalKg, pesoMaiorPecaKg, alertaPeso, parametrosUsados: parametros, passos };
}

/** Janela fixa: um único painel, sem partes móveis. */
function calcularFixa(input: JanelaInput, parametros: ParametrosJanela): ResultadoJanela {
  const passos: string[] = [];

  const larguraMm = arredondar(input.larguraVaoMm - parametros.descontoLateralMm * 2);
  passos.push(`Largura do vidro = largura do vão (${input.larguraVaoMm} mm) − desconto lateral do kit (${parametros.descontoLateralMm} mm × 2) = ${larguraMm} mm.`);
  const alturaMm = arredondar(input.alturaVaoMm - parametros.descontoAlturaMm * 2);
  passos.push(`Altura do vidro = altura do vão (${input.alturaVaoMm} mm) − desconto de marco superior/inferior (${parametros.descontoAlturaMm} mm × 2) = ${alturaMm} mm.`);

  const peso = pesoVidro(larguraMm, alturaMm, input.espessuraMm, parametros.coeficientePeso);
  const paineis: PainelJanela[] = [{ identificacao: "V1", tipo: "fixa", larguraMm, alturaMm, pesoKg: peso }];

  const perfis = [
    { descricao: "Perfil de marco (perímetro)", comprimentoMm: arredondar(2 * (input.larguraVaoMm + input.alturaVaoMm)), quantidade: 1 },
  ];
  const acessorios = [
    { descricao: "Baguete de fixação", quantidade: 4 },
    { descricao: "Silicone estrutural", quantidade: 1 },
  ];

  return finalizar("fixa", paineis, perfis, acessorios, parametros, passos);
}

/** Janela de correr: 2 folhas, uma fixa e uma móvel, com transpasse central. */
function calcularCorrer(input: JanelaInput, parametros: ParametrosJanela): ResultadoJanela {
  const passos: string[] = [];

  const larguraUtilMm = arredondar(input.larguraVaoMm - parametros.descontoLateralMm * 2);
  passos.push(`Largura útil = largura do vão (${input.larguraVaoMm} mm) − desconto lateral do kit (${parametros.descontoLateralMm} mm × 2) = ${larguraUtilMm} mm.`);
  const alturaMm = arredondar(input.alturaVaoMm - parametros.descontoAlturaMm * 2);
  passos.push(`Altura do vidro = altura do vão (${input.alturaVaoMm} mm) − desconto de marco superior/inferior (${parametros.descontoAlturaMm} mm × 2) = ${alturaMm} mm.`);

  const larguraCadaFolhaMm = arredondar((larguraUtilMm + parametros.transpasseMm) / 2);
  passos.push(`Largura de cada folha = (largura útil (${larguraUtilMm} mm) + transpasse do kit (${parametros.transpasseMm} mm)) ÷ 2 folhas = ${larguraCadaFolhaMm} mm.`);

  const peso = pesoVidro(larguraCadaFolhaMm, alturaMm, input.espessuraMm, parametros.coeficientePeso);
  const paineis: PainelJanela[] = [
    { identificacao: "V1", tipo: "fixa", larguraMm: larguraCadaFolhaMm, alturaMm, pesoKg: peso },
    { identificacao: "V2", tipo: "movel", larguraMm: larguraCadaFolhaMm, alturaMm, pesoKg: peso },
  ];
  passos.push("A folha V1 fica fixa e a V2 desliza sobre o trilho inferior.");

  const perfis = [
    { descricao: "Trilho superior", comprimentoMm: input.larguraVaoMm, quantidade: 1 },
    { descricao: "Trilho inferior", comprimentoMm: input.larguraVaoMm, quantidade: 1 },
    { descricao: "Perfil U lateral", comprimentoMm: alturaMm, quantidade: 2 },
  ];
  const acessorios = [
    { descricao: "Roldana", quantidade: 2 },
    { descricao: "Fecho/trinco", quantidade: 1 },
    { descricao: "Escova de vedação", quantidade: 2 },
  ];

  return finalizar("correr", paineis, perfis, acessorios, parametros, passos);
}

export function calcularJanela(
  input: JanelaInput,
  parametros: ParametrosJanela = PARAMETROS_JANELA_PADRAO
): ResultadoJanela {
  return input.tipoJanela === "fixa" ? calcularFixa(input, parametros) : calcularCorrer(input, parametros);
}
