/**
 * Espelhos, tampos e prateleiras: painel plano retangular simples — sem a
 * complexidade de kit/perfil das outras calculadoras. Área, peso (mesma
 * fórmula validada do resto do sistema) e a lista de furos de fixação
 * informados pelo profissional (não calculamos posição de furo porque isso
 * depende do padrão de fixação de cada instalação, que não temos como
 * verificar).
 */

export type TipoEspelhoTampo = "espelho" | "tampo" | "prateleira";
export type AcabamentoBorda = "lapidada" | "polida" | "boleada" | "sem_acabamento";

export type EspelhoTampoInput = {
  tipo: TipoEspelhoTampo;
  larguraMm: number;
  alturaMm: number;
  espessuraMm: number;
  coeficientePeso: number;
  acabamentoBorda: AcabamentoBorda;
  quantidadeFurosFixacao: number;
};

export type ResultadoEspelhoTampo = {
  areaM2: number;
  perimetroMm: number;
  pesoKg: number;
  alertaPeso: string | null;
  passos: string[];
};

function arredondar(valor: number, casas = 2) {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

export function calcularEspelhoTampo(input: EspelhoTampoInput): ResultadoEspelhoTampo {
  const passos: string[] = [];

  const areaM2 = arredondar((input.larguraMm / 1000) * (input.alturaMm / 1000));
  passos.push(`Área = (${input.larguraMm} mm ÷ 1000) × (${input.alturaMm} mm ÷ 1000) = ${areaM2} m².`);

  const perimetroMm = arredondar(2 * (input.larguraMm + input.alturaMm), 0);
  passos.push(`Perímetro = 2 × (${input.larguraMm} + ${input.alturaMm}) = ${perimetroMm} mm — usado pra calcular o acabamento de borda.`);

  const pesoKg = arredondar(areaM2 * input.espessuraMm * input.coeficientePeso);
  passos.push(`Peso = área (${areaM2} m²) × espessura (${input.espessuraMm} mm) × coeficiente (${input.coeficientePeso}) = ${pesoKg} kg.`);

  if (input.quantidadeFurosFixacao > 0) {
    passos.push(`${input.quantidadeFurosFixacao} furo(s) de fixação — posição deve ser marcada na instalação conforme o padrão do suporte usado.`);
  }

  const alertaPeso =
    pesoKg > 40
      ? `${pesoKg} kg — acima de 40 kg. Use ferragens reforçadas e transporte com equipamento.`
      : pesoKg > 25
        ? `${pesoKg} kg — acima de 25 kg. Recomenda-se instalação com pelo menos 2 pessoas.`
        : null;

  return { areaM2, perimetroMm, pesoKg, alertaPeso, passos };
}
