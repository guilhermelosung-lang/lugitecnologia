/**
 * Checagem de esquadro: num retângulo verdadeiro, as duas diagonais têm o
 * mesmo comprimento — é geometria básica, não uma fórmula do setor. Se a
 * diferença entre as diagonais passa da tolerância, o vão está fora de
 * esquadro (torto) e isso afeta o encaixe do vidro/esquadria.
 */
export type ResultadoEsquadro = {
  diferencaMm: number;
  dentroTolerancia: boolean;
  mensagem: string;
};

export function verificarEsquadro(
  diagonal1Mm: number,
  diagonal2Mm: number,
  toleranciaMm = 5
): ResultadoEsquadro {
  const diferencaMm = Math.round(Math.abs(diagonal1Mm - diagonal2Mm) * 10) / 10;
  const dentroTolerancia = diferencaMm <= toleranciaMm;
  return {
    diferencaMm,
    dentroTolerancia,
    mensagem: dentroTolerancia
      ? `Diferença de ${diferencaMm} mm entre as diagonais — dentro da tolerância de ${toleranciaMm} mm.`
      : `Diferença de ${diferencaMm} mm entre as diagonais — FORA da tolerância de ${toleranciaMm} mm. O vão está fora de esquadro.`,
  };
}
