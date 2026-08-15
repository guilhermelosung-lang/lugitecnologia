export function calcularValorOrcamento(
  itens: { quantidade: number; preco_unitario: number }[],
  descontoValor: number,
  descontoPercentual: number
): number {
  const subtotal = itens.reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0);
  const desconto = descontoValor + (subtotal * descontoPercentual) / 100;
  return Math.max(subtotal - desconto, 0);
}

/** Últimos `n` meses, do mais antigo pro mais recente, como {inicio, fim, label}. */
export function ultimosMeses(n: number) {
  const meses: { inicio: Date; fim: Date; label: string }[] = [];
  const agora = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const inicio = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const fim = new Date(agora.getFullYear(), agora.getMonth() - i + 1, 1);
    const label = inicio.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    meses.push({ inicio, fim, label });
  }
  return meses;
}
