export type TipoPorta = "abrir" | "pivotante" | "correr" | "com_fixo";

export type PortaInput = {
  tipoPorta: TipoPorta;
  larguraVaoMm: number;
  alturaVaoMm: number;
  ladoDobradica: "esquerda" | "direita";
  sentidoAbertura: "dentro" | "fora" | "dupla_acao";
  quantidadeDobradicas: 2 | 3;
  larguraFixoMm?: number;
  espessuraMm: number;
};

export type ParametrosPorta = {
  folgaLateralMm: number;
  folgaAlturaMm: number;
  distanciaDobradicaBordaMm: number;
  transpasseCorrerMm: number;
  coeficientePeso: number;
};

export const PARAMETROS_PORTA_PADRAO: ParametrosPorta = {
  folgaLateralMm: 5,
  folgaAlturaMm: 10,
  distanciaDobradicaBordaMm: 150,
  transpasseCorrerMm: 40,
  coeficientePeso: 2.5,
};

export type FuroCalculado = {
  descricao: string;
  distanciaBordaLateralMm: number;
  distanciaBordaSuperiorMm: number;
};

export type PainelPorta = {
  identificacao: string;
  descricao: string;
  larguraMm: number;
  alturaMm: number;
  pesoKg: number;
};

export type ResultadoPorta = {
  tipoPorta: TipoPorta;
  paineis: PainelPorta[];
  aberturaUtilMm: number;
  furos: FuroCalculado[];
  ferragens: { descricao: string; quantidade: number }[];
  pesoTotalKg: number;
  pesoMaiorPecaKg: number;
  alertaPeso: string | null;
  parametrosUsados: ParametrosPorta;
  passos: string[];
};

const DISTANCIA_BORDA_LATERAL_FURO_MM = 70;

function arredondar(valor: number, casas = 1) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

function pesoVidro(larguraMm: number, alturaMm: number, espessuraMm: number, coeficiente: number) {
  return arredondar((larguraMm / 1000) * (alturaMm / 1000) * espessuraMm * coeficiente, 2);
}

function finalizar(
  tipoPorta: TipoPorta,
  paineis: PainelPorta[],
  aberturaUtilMm: number,
  furos: FuroCalculado[],
  ferragens: { descricao: string; quantidade: number }[],
  parametros: ParametrosPorta,
  passos: string[]
): ResultadoPorta {
  const pesoTotalKg = arredondar(paineis.reduce((acc, p) => acc + p.pesoKg, 0), 2);
  const pesoMaiorPecaKg = arredondar(Math.max(...paineis.map((p) => p.pesoKg)), 2);
  const alertaPeso =
    pesoMaiorPecaKg > 40
      ? `A peça mais pesada tem ${pesoMaiorPecaKg} kg — acima de 40 kg, use ferragens reforçadas e pelo menos 2 instaladores.`
      : null;
  return {
    tipoPorta,
    paineis,
    aberturaUtilMm,
    furos,
    ferragens,
    pesoTotalKg,
    pesoMaiorPecaKg,
    alertaPeso,
    parametrosUsados: parametros,
    passos,
  };
}

/** Porta de abrir: folha única com dobradiças. */
function calcularAbrir(input: PortaInput, parametros: ParametrosPorta): ResultadoPorta {
  const passos: string[] = [];

  const larguraMm = arredondar(input.larguraVaoMm - parametros.folgaLateralMm * 2);
  passos.push(
    `Largura da porta = largura do vão (${input.larguraVaoMm} mm) − folga lateral do kit (${parametros.folgaLateralMm} mm × 2) = ${larguraMm} mm.`
  );
  const alturaMm = arredondar(input.alturaVaoMm - parametros.folgaAlturaMm);
  passos.push(
    `Altura da porta = altura do vão (${input.alturaVaoMm} mm) − folga de piso/verga (${parametros.folgaAlturaMm} mm) = ${alturaMm} mm.`
  );

  const furos: FuroCalculado[] = [];
  furos.push({ descricao: "Dobradiça superior", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: parametros.distanciaDobradicaBordaMm });
  furos.push({ descricao: "Dobradiça inferior", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: arredondar(alturaMm - parametros.distanciaDobradicaBordaMm) });
  if (input.quantidadeDobradicas === 3) {
    furos.push({ descricao: "Dobradiça central", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: arredondar(alturaMm / 2) });
  }
  passos.push(
    `${input.quantidadeDobradicas} furos de dobradiça no lado ${input.ladoDobradica}, a ${parametros.distanciaDobradicaBordaMm} mm de cada borda${input.quantidadeDobradicas === 3 ? ", mais 1 central" : ""}.`
  );

  const posicaoPuxadorDoPisoMm = Math.min(1000, alturaMm - 100);
  const distanciaPuxadorTopoMm = arredondar(alturaMm - posicaoPuxadorDoPisoMm);
  furos.push({ descricao: "Fechadura/puxador", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: distanciaPuxadorTopoMm });
  passos.push(`Furo de fechadura/puxador a ~1000 mm do piso = ${distanciaPuxadorTopoMm} mm do topo.`);

  const ferragens = [
    { descricao: `Dobradiça (lado ${input.ladoDobradica}, abertura para ${input.sentidoAbertura === "dentro" ? "dentro" : "fora"})`, quantidade: input.quantidadeDobradicas },
    { descricao: "Fechadura ou puxador", quantidade: 1 },
    { descricao: "Batente/aparador", quantidade: 1 },
  ];

  const peso = pesoVidro(larguraMm, alturaMm, input.espessuraMm, parametros.coeficientePeso);
  const paineis: PainelPorta[] = [{ identificacao: "V1", descricao: "Folha de abrir", larguraMm, alturaMm, pesoKg: peso }];

  return finalizar("abrir", paineis, larguraMm, furos, ferragens, parametros, passos);
}

/** Porta pivotante: gira em pivôs de piso e teto, sem dobradiças laterais. */
function calcularPivotante(input: PortaInput, parametros: ParametrosPorta): ResultadoPorta {
  const passos: string[] = [];

  const larguraMm = arredondar(input.larguraVaoMm - parametros.folgaLateralMm * 2);
  passos.push(`Largura da porta = largura do vão (${input.larguraVaoMm} mm) − folga lateral (${parametros.folgaLateralMm} mm × 2) = ${larguraMm} mm.`);
  const alturaMm = arredondar(input.alturaVaoMm - parametros.folgaAlturaMm);
  passos.push(`Altura da porta = altura do vão (${input.alturaVaoMm} mm) − folga de piso/verga (${parametros.folgaAlturaMm} mm) = ${alturaMm} mm.`);

  const furos: FuroCalculado[] = [
    { descricao: "Pivô inferior", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: alturaMm },
    { descricao: "Pivô superior", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: 0 },
  ];
  passos.push(
    `Pivôs de piso e teto no lado ${input.ladoDobradica} — posição exata deve ser conferida com a ficha técnica do kit pivotante escolhido.`
  );

  const posicaoPuxadorDoPisoMm = Math.min(1000, alturaMm - 100);
  const distanciaPuxadorTopoMm = arredondar(alturaMm - posicaoPuxadorDoPisoMm);
  furos.push({ descricao: "Fechadura/puxador", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: distanciaPuxadorTopoMm });
  passos.push(`Furo de fechadura/puxador a ~1000 mm do piso = ${distanciaPuxadorTopoMm} mm do topo.`);

  const ferragens = [
    { descricao: "Kit pivotante (piso + teto)", quantidade: 1 },
    { descricao: "Fechadura ou puxador", quantidade: 1 },
    { descricao: "Batente/aparador", quantidade: 1 },
  ];

  const peso = pesoVidro(larguraMm, alturaMm, input.espessuraMm, parametros.coeficientePeso);
  const paineis: PainelPorta[] = [{ identificacao: "V1", descricao: "Folha pivotante", larguraMm, alturaMm, pesoKg: peso }];

  return finalizar("pivotante", paineis, larguraMm, furos, ferragens, parametros, passos);
}

/** Porta de correr: painel único deslizante, com transpasse sobre o vão. */
function calcularCorrer(input: PortaInput, parametros: ParametrosPorta): ResultadoPorta {
  const passos: string[] = [];

  const larguraMm = arredondar(input.larguraVaoMm + parametros.transpasseCorrerMm - parametros.folgaLateralMm);
  passos.push(
    `Largura do painel deslizante = largura do vão (${input.larguraVaoMm} mm) + transpasse do kit (${parametros.transpasseCorrerMm} mm) − folga do trilho (${parametros.folgaLateralMm} mm) = ${larguraMm} mm. Considerando painel único cobrindo todo o vão — confirme com o kit se o seu modelo usa mais de um painel.`
  );
  const alturaMm = arredondar(input.alturaVaoMm - parametros.folgaAlturaMm);
  passos.push(`Altura do painel = altura do vão (${input.alturaVaoMm} mm) − folga de trilho superior/inferior (${parametros.folgaAlturaMm} mm) = ${alturaMm} mm.`);

  const furos: FuroCalculado[] = [
    { descricao: "Fechadura/puxador", distanciaBordaLateralMm: DISTANCIA_BORDA_LATERAL_FURO_MM, distanciaBordaSuperiorMm: arredondar(alturaMm - Math.min(1000, alturaMm - 100)) },
  ];
  passos.push("Sem furos de dobradiça — o painel corre sobre trilhos superior e inferior.");

  const ferragens = [
    { descricao: "Roldana (superior + inferior)", quantidade: 2 },
    { descricao: "Trilho superior", quantidade: 1 },
    { descricao: "Trilho inferior", quantidade: 1 },
    { descricao: "Fechadura ou puxador", quantidade: 1 },
    { descricao: "Batente/aparador", quantidade: 1 },
  ];

  const peso = pesoVidro(larguraMm, alturaMm, input.espessuraMm, parametros.coeficientePeso);
  const paineis: PainelPorta[] = [{ identificacao: "V1", descricao: "Painel deslizante", larguraMm, alturaMm, pesoKg: peso }];

  return finalizar("correr", paineis, arredondar(input.larguraVaoMm - parametros.folgaLateralMm), furos, ferragens, parametros, passos);
}

/** Porta de abrir com fixo lateral: folha com dobradiças + painel fixo ao lado. */
function calcularComFixo(input: PortaInput, parametros: ParametrosPorta): ResultadoPorta {
  if (!input.larguraFixoMm || input.larguraFixoMm <= 0) {
    throw new Error("Informe a largura do fixo lateral.");
  }

  const base = calcularAbrir(
    { ...input, larguraVaoMm: input.larguraVaoMm - input.larguraFixoMm },
    parametros
  );
  const passos = [...base.passos];
  passos.push(
    `Fixo lateral: largura reservada de ${input.larguraFixoMm} mm no vão total, o restante (${arredondar(input.larguraVaoMm - input.larguraFixoMm)} mm) vai para a folha de abrir calculada acima.`
  );

  const larguraFixoVidroMm = arredondar(input.larguraFixoMm - parametros.folgaLateralMm * 2);
  const alturaFixoMm = base.paineis[0].alturaMm;
  const pesoFixo = pesoVidro(larguraFixoVidroMm, alturaFixoMm, input.espessuraMm, parametros.coeficientePeso);
  passos.push(
    `Largura do vidro fixo = largura reservada (${input.larguraFixoMm} mm) − folga lateral (${parametros.folgaLateralMm} mm × 2) = ${larguraFixoVidroMm} mm.`
  );

  const paineis: PainelPorta[] = [
    ...base.paineis,
    { identificacao: "V2", descricao: "Fixo lateral", larguraMm: larguraFixoVidroMm, alturaMm: alturaFixoMm, pesoKg: pesoFixo },
  ];

  const ferragens = [...base.ferragens, { descricao: "Perfil U de fixação do fixo", quantidade: 1 }];

  return finalizar("com_fixo", paineis, base.aberturaUtilMm, base.furos, ferragens, parametros, passos);
}

export function calcularPorta(
  input: PortaInput,
  parametros: ParametrosPorta = PARAMETROS_PORTA_PADRAO
): ResultadoPorta {
  switch (input.tipoPorta) {
    case "abrir":
      return calcularAbrir(input, parametros);
    case "pivotante":
      return calcularPivotante(input, parametros);
    case "correr":
      return calcularCorrer(input, parametros);
    case "com_fixo":
      return calcularComFixo(input, parametros);
  }
}
