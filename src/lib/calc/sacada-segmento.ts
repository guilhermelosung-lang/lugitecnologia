import { PARAMETROS_SACADA_PADRAO, type ParametrosSacada } from "@/lib/calc/sacada";

/**
 * Motor de cálculo por segmento, compartilhado pelas cortinas de vidro em L
 * e em U. Cada segmento é calculado de forma independente — nunca somando
 * os vãos — seguindo a mesma lógica validada da sacada reta (vão → desconto
 * de cantoneira nas pontas que encostam na parede → quantidade de painéis →
 * largura base → desconto de guarnição → largura do vidro).
 */

export type PontaTipo = "parede" | "encontro";

export type SegmentoInput = {
  id: string;
  rotulo: string;
  larguraMm: number;
  alturaEsquerdaMm: number;
  alturaCentralMm: number;
  alturaDireitaMm: number;
  quantidadePaineis: number;
  pontaInicial: PontaTipo;
  pontaFinal: PontaTipo;
};

export type AlternativaQuantidade = {
  quantidade: number;
  larguraVidroMm: number;
  dentroFaixa: boolean;
};

export type AlternativasSegmento = {
  quantidadeSugeridaInicial: number;
  recomendada: AlternativaQuantidade | null;
  menosVidros: AlternativaQuantidade | null;
  maisVidros: AlternativaQuantidade | null;
  todas: AlternativaQuantidade[];
};

export type PainelSegmento = {
  codigo: string;
  larguraMm: number;
  alturaMm: number;
  espessuraMm: number;
  comprimentoLeitoMm: number;
  pesoKg: number;
  usinagem: { posicaoMm: number; comprimentoMm: number; lado: "esquerda" | "direita" } | null;
};

export type ConferenciaSegmento = {
  larguraReconstruidaMm: number;
  diferencaMm: number;
  status: "verde" | "amarelo" | "vermelho";
  mensagem: string;
};

export type ResultadoSegmento = {
  id: string;
  rotulo: string;
  larguraInformadaMm: number;
  pontaInicial: PontaTipo;
  pontaFinal: PontaTipo;
  descontoInicialMm: number;
  descontoFinalMm: number;
  larguraUtilMm: number;
  quantidadePaineis: number;
  larguraBaseMm: number;
  larguraVidroMm: number;
  alturaEsquerdaMm: number;
  alturaCentralMm: number;
  alturaDireitaMm: number;
  alturaMenorMm: number;
  alturaMaiorMm: number;
  alturaMediaMm: number;
  diferencaAlturaMm: number;
  criterioAltura: "menor" | "media";
  alertaAltura: string | null;
  alturaAdotadaMm: number;
  alturaVidroMm: number;
  comprimentoLeitoMm: number;
  paineis: PainelSegmento[];
  pesoTotalKg: number;
  pesoMaiorPecaKg: number;
  conferencia: ConferenciaSegmento;
  passos: string[];
};

function arredondar(valor: number, casas = 2) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

function descontoDaPonta(tipo: PontaTipo, parametros: ParametrosSacada) {
  return tipo === "parede" ? parametros.descontoCantoneiraMm : 0;
}

/**
 * Testa quantidades de painéis ao redor da regra inicial (largura ÷ 500mm)
 * e classifica cada uma pela largura final do vidro (já com os descontos
 * de ponta e de guarnição aplicados), mantendo a faixa preferencial de
 * 450–600mm. Expande a busca até achar pelo menos uma opção dentro da
 * faixa, ou até um raio máximo — nesse caso não existe opção ideal e o
 * profissional precisa decidir manualmente.
 */
export function sugerirAlternativasSegmento(
  larguraMm: number,
  pontaInicial: PontaTipo,
  pontaFinal: PontaTipo,
  parametros: ParametrosSacada = PARAMETROS_SACADA_PADRAO
): AlternativasSegmento {
  const descontoInicial = descontoDaPonta(pontaInicial, parametros);
  const descontoFinal = descontoDaPonta(pontaFinal, parametros);
  const larguraUtil = larguraMm - descontoInicial - descontoFinal;
  const quantidadeSugeridaInicial = Math.max(1, Math.round(larguraMm / 500));

  function calcular(qtd: number): AlternativaQuantidade {
    const base = larguraUtil / qtd;
    const vidro = arredondar(base - parametros.descontoGuarnicaoMm);
    return { quantidade: qtd, larguraVidroMm: vidro, dentroFaixa: vidro >= 450 && vidro <= 600 };
  }

  let raio = 2;
  let candidatos: AlternativaQuantidade[] = [];
  while (raio <= 8) {
    const qtds = new Set<number>();
    for (let d = -raio; d <= raio; d++) {
      const q = quantidadeSugeridaInicial + d;
      if (q >= 1) qtds.add(q);
    }
    candidatos = Array.from(qtds)
      .sort((a, b) => a - b)
      .map(calcular);
    if (candidatos.some((c) => c.dentroFaixa)) break;
    raio += 2;
  }

  const dentroFaixa = candidatos.filter((c) => c.dentroFaixa);
  const recomendada =
    dentroFaixa.length > 0
      ? dentroFaixa.reduce((melhor, atual) =>
          Math.abs(atual.quantidade - quantidadeSugeridaInicial) < Math.abs(melhor.quantidade - quantidadeSugeridaInicial)
            ? atual
            : melhor
        )
      : candidatos.find((c) => c.quantidade === quantidadeSugeridaInicial) ?? calcular(quantidadeSugeridaInicial);

  const menosVidros =
    dentroFaixa.length > 0
      ? dentroFaixa.reduce((menor, atual) => (atual.quantidade < menor.quantidade ? atual : menor))
      : null;
  const maisVidros =
    dentroFaixa.length > 0
      ? dentroFaixa.reduce((maior, atual) => (atual.quantidade > maior.quantidade ? atual : maior))
      : null;

  return {
    quantidadeSugeridaInicial,
    recomendada,
    menosVidros: menosVidros && menosVidros.quantidade !== recomendada.quantidade ? menosVidros : null,
    maisVidros: maisVidros && maisVidros.quantidade !== recomendada.quantidade ? maisVidros : null,
    todas: candidatos,
  };
}

export function calcularSegmento(
  input: SegmentoInput,
  parametros: ParametrosSacada = PARAMETROS_SACADA_PADRAO,
  espessuraMm: number,
  toleranciaConferenciaMm = { verde: 1, amarelo: 5 }
): ResultadoSegmento {
  const passos: string[] = [];
  const descontoInicialMm = descontoDaPonta(input.pontaInicial, parametros);
  const descontoFinalMm = descontoDaPonta(input.pontaFinal, parametros);

  const larguraUtilMm = input.larguraMm - descontoInicialMm - descontoFinalMm;
  passos.push(
    `[${input.rotulo}] Largura útil = vão (${input.larguraMm} mm) − desconto nas pontas que encostam na parede (${descontoInicialMm + descontoFinalMm} mm) = ${larguraUtilMm} mm. Nenhum desconto adicional é aplicado no encontro entre segmentos.`
  );

  const larguraBaseMm = arredondar(larguraUtilMm / input.quantidadePaineis);
  passos.push(
    `[${input.rotulo}] Largura base de cada painel = largura útil (${larguraUtilMm} mm) ÷ ${input.quantidadePaineis} painéis = ${larguraBaseMm} mm.`
  );

  const larguraVidroMm = arredondar(larguraBaseMm - parametros.descontoGuarnicaoMm);
  passos.push(
    `[${input.rotulo}] Largura do vidro = largura base (${larguraBaseMm} mm) − guarnição (${parametros.descontoGuarnicaoMm} mm) = ${larguraVidroMm} mm.`
  );

  const alturaMenorMm = Math.min(input.alturaEsquerdaMm, input.alturaCentralMm, input.alturaDireitaMm);
  const alturaMaiorMm = Math.max(input.alturaEsquerdaMm, input.alturaCentralMm, input.alturaDireitaMm);
  const alturaMediaMm = arredondar((input.alturaEsquerdaMm + input.alturaCentralMm + input.alturaDireitaMm) / 3);
  const diferencaAlturaMm = arredondar(alturaMaiorMm - alturaMenorMm);
  const criterioAltura: "menor" | "media" = diferencaAlturaMm > 30 ? "media" : "menor";
  const alturaAdotadaMm = criterioAltura === "media" ? alturaMediaMm : alturaMenorMm;
  const alertaAltura =
    criterioAltura === "media"
      ? `[${input.rotulo}] Diferença de ${diferencaAlturaMm} mm entre as alturas medidas — acima da tolerância de 30 mm. Foi usada a média (${alturaMediaMm} mm). Confirme a medição antes de liberar para têmpera.`
      : null;
  passos.push(
    criterioAltura === "media"
      ? `[${input.rotulo}] Altura adotada = média das três medidas = ${alturaMediaMm} mm (diferença de ${diferencaAlturaMm} mm passou de 30 mm).`
      : `[${input.rotulo}] Altura adotada = menor das três medidas = ${alturaMenorMm} mm.`
  );

  const alturaVidroMm = arredondar(alturaAdotadaMm - parametros.descontoAlturaMm);
  passos.push(
    `[${input.rotulo}] Altura do vidro = altura adotada (${alturaAdotadaMm} mm) − desconto de trilho (${parametros.descontoAlturaMm} mm) = ${alturaVidroMm} mm.`
  );

  const comprimentoLeitoMm = arredondar(larguraVidroMm - parametros.descontoLeitoMm);
  passos.push(
    `[${input.rotulo}] Leito de colagem = largura do vidro (${larguraVidroMm} mm) − ${parametros.descontoLeitoMm} mm = ${comprimentoLeitoMm} mm, gerado para cada um dos ${input.quantidadePaineis} painéis.`
  );

  function pesoVidro(larguraMm: number, alturaMm: number) {
    return arredondar((larguraMm / 1000) * (alturaMm / 1000) * espessuraMm * parametros.coeficientePeso, 2);
  }

  const paineis: PainelSegmento[] = Array.from({ length: input.quantidadePaineis }, (_, i) => ({
    codigo: `${input.id}-V${i + 1}`,
    larguraMm: larguraVidroMm,
    alturaMm: alturaVidroMm,
    espessuraMm,
    comprimentoLeitoMm,
    pesoKg: pesoVidro(larguraVidroMm, alturaVidroMm),
    usinagem: null,
  }));

  const pesoTotalKg = arredondar(paineis.reduce((acc, p) => acc + p.pesoKg, 0));
  const pesoMaiorPecaKg = arredondar(Math.max(...paineis.map((p) => p.pesoKg)));

  const larguraReconstruidaMm = arredondar(
    (larguraVidroMm + parametros.descontoGuarnicaoMm) * input.quantidadePaineis + descontoInicialMm + descontoFinalMm
  );
  const diferencaConferenciaMm = arredondar(Math.abs(larguraReconstruidaMm - input.larguraMm));
  const status: ConferenciaSegmento["status"] =
    diferencaConferenciaMm <= toleranciaConferenciaMm.verde
      ? "verde"
      : diferencaConferenciaMm <= toleranciaConferenciaMm.amarelo
        ? "amarelo"
        : "vermelho";
  const conferencia: ConferenciaSegmento = {
    larguraReconstruidaMm,
    diferencaMm: diferencaConferenciaMm,
    status,
    mensagem:
      status === "verde"
        ? "Cálculo conferido."
        : status === "amarelo"
          ? "Pequena diferença causada por arredondamento."
          : "Medidas não fecham. Revisar projeto.",
  };
  passos.push(
    `[${input.rotulo}] Conferência inversa: (${larguraVidroMm} + ${parametros.descontoGuarnicaoMm}) × ${input.quantidadePaineis} + ${descontoInicialMm + descontoFinalMm} = ${larguraReconstruidaMm} mm, contra o vão informado de ${input.larguraMm} mm (diferença de ${diferencaConferenciaMm} mm — ${conferencia.mensagem})`
  );

  return {
    id: input.id,
    rotulo: input.rotulo,
    larguraInformadaMm: input.larguraMm,
    pontaInicial: input.pontaInicial,
    pontaFinal: input.pontaFinal,
    descontoInicialMm,
    descontoFinalMm,
    larguraUtilMm,
    quantidadePaineis: input.quantidadePaineis,
    larguraBaseMm,
    larguraVidroMm,
    alturaEsquerdaMm: input.alturaEsquerdaMm,
    alturaCentralMm: input.alturaCentralMm,
    alturaDireitaMm: input.alturaDireitaMm,
    alturaMenorMm,
    alturaMaiorMm,
    alturaMediaMm,
    diferencaAlturaMm,
    criterioAltura,
    alertaAltura,
    alturaAdotadaMm,
    alturaVidroMm,
    comprimentoLeitoMm,
    paineis,
    pesoTotalKg,
    pesoMaiorPecaKg,
    conferencia,
    passos,
  };
}

/** Aplica a usinagem de saída (só no segmento/lado onde existe abertura). */
export function aplicarUsinagem(
  segmento: ResultadoSegmento,
  lado: "esquerda" | "direita",
  parametros: ParametrosSacada
): ResultadoSegmento {
  const posicaoMm = arredondar(segmento.larguraVidroMm - parametros.usinagemRecuoMm);
  const indice = lado === "direita" ? segmento.paineis.length - 1 : 0;
  const paineis = segmento.paineis.map((p, i) =>
    i === indice
      ? { ...p, usinagem: { posicaoMm, comprimentoMm: parametros.usinagemComprimentoMm, lado } }
      : p
  );
  return { ...segmento, paineis };
}

export function acessoriosDoSegmento(segmento: ResultadoSegmento) {
  const qtd = segmento.quantidadePaineis;
  return [
    { descricao: `Deslizante superior + inferior (${segmento.rotulo})`, quantidade: qtd * 2 },
    { descricao: `Estacionamento (${segmento.rotulo})`, quantidade: qtd },
    { descricao: `Tampa de leito (${segmento.rotulo})`, quantidade: qtd * 2 },
    { descricao: `Guarnição de vedação (${segmento.rotulo})`, quantidade: qtd },
    { descricao: `Escova (${segmento.rotulo})`, quantidade: qtd },
  ];
}

export function perfisDoSegmento(segmento: ResultadoSegmento) {
  const perfis = [
    { descricao: `Perfil U superior (${segmento.rotulo})`, comprimentoMm: segmento.larguraInformadaMm, quantidade: 1 },
    { descricao: `Perfil U inferior (${segmento.rotulo})`, comprimentoMm: segmento.larguraInformadaMm, quantidade: 1 },
  ];
  if (segmento.pontaInicial === "parede" || segmento.pontaFinal === "parede") {
    const pontasParede = (segmento.pontaInicial === "parede" ? 1 : 0) + (segmento.pontaFinal === "parede" ? 1 : 0);
    perfis.push({
      descricao: `Cantoneira de parede (${segmento.rotulo})`,
      comprimentoMm: segmento.alturaVidroMm,
      quantidade: pontasParede,
    });
  }
  return perfis;
}
