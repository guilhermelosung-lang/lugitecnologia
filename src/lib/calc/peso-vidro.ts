/**
 * Peso e segurança do vidro: reaproveita a MESMA fórmula de peso já
 * validada e usada em todas as calculadoras (box, sacada, porta, janela) —
 * área × espessura × coeficiente. Não inventa limites de norma técnica
 * (NBR 7199 etc.) porque não temos o texto da norma verificado; os alertas
 * usam os mesmos limiares de peso (25kg / 40kg) já aplicados nas outras
 * calculadoras do sistema.
 */

export type TipoInstalacaoVidro = "porta_janela" | "guarda_corpo" | "piso" | "cobertura" | "outro";

export type PesoVidroInput = {
  larguraMm: number;
  alturaMm: number;
  espessuraMm: number;
  coeficientePeso: number;
  tipoInstalacao: TipoInstalacaoVidro;
  numeroPessoas: number;
};

export type ResultadoPesoVidro = {
  areaM2: number;
  pesoKg: number;
  pesoPorM2Kg: number;
  alertaPeso: string | null;
  recomendacaoTransporte: string;
  passos: string[];
};

function arredondar(valor: number, casas = 2) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

export function calcularPesoVidro(input: PesoVidroInput): ResultadoPesoVidro {
  const passos: string[] = [];

  const areaM2 = arredondar((input.larguraMm / 1000) * (input.alturaMm / 1000));
  passos.push(`Área = (${input.larguraMm} mm ÷ 1000) × (${input.alturaMm} mm ÷ 1000) = ${areaM2} m².`);

  const pesoKg = arredondar(areaM2 * input.espessuraMm * input.coeficientePeso);
  passos.push(
    `Peso = área (${areaM2} m²) × espessura (${input.espessuraMm} mm) × coeficiente do vidro (${input.coeficientePeso}) = ${pesoKg} kg.`
  );

  const pesoPorM2Kg = arredondar(input.espessuraMm * input.coeficientePeso);

  const alertaPeso =
    pesoKg > 40
      ? `${pesoKg} kg — acima de 40 kg. Use ferragens reforçadas e transporte com equipamento (ventosas/carrinho), nunca manual.`
      : pesoKg > 25
        ? `${pesoKg} kg — acima de 25 kg. Recomenda-se transporte e instalação com pelo menos 2 pessoas.`
        : null;

  let quantidadeRecomendada = 1;
  if (pesoKg > 60) quantidadeRecomendada = 4;
  else if (pesoKg > 40) quantidadeRecomendada = 3;
  else if (pesoKg > 25) quantidadeRecomendada = 2;

  const recomendacaoTransporte =
    quantidadeRecomendada > 1
      ? `Recomenda-se pelo menos ${quantidadeRecomendada} pessoas (ou equipamento de içamento) para manusear essa peça com segurança.`
      : "Uma pessoa consegue manusear essa peça com segurança, mas sempre use luvas e óculos de proteção.";

  if (input.numeroPessoas > 0 && input.numeroPessoas < quantidadeRecomendada) {
    passos.push(
      `⚠️ Você informou ${input.numeroPessoas} pessoa(s) disponíveis, abaixo da recomendação de ${quantidadeRecomendada} para essa peça.`
    );
  }

  return {
    areaM2,
    pesoKg,
    pesoPorM2Kg,
    alertaPeso,
    recomendacaoTransporte,
    passos,
  };
}
