export const TABELA_LABEL: Record<string, string> = {
  clientes: "Clientes",
  obras: "Obras",
  ambientes: "Ambientes",
  orcamentos: "Orçamentos",
  orcamento_itens: "Itens de orçamento",
  fornecedores: "Fornecedores",
  sistemas: "Catálogo (sistemas)",
  kits: "Catálogo (kits)",
  kit_itens: "Catálogo (itens do kit)",
  parametros_calculo: "Parâmetros de cálculo",
  calculos_box: "Cálculo de box",
  calculos_sacada: "Cálculo de sacada",
  calculos_porta: "Cálculo de porta",
  calculos_janela: "Cálculo de janela",
  itens_estoque: "Estoque (itens)",
  movimentacoes_estoque: "Estoque (movimentações)",
  tabela_precos_vidro: "Preços de vidro",
  usuarios: "Usuários",
  empresas: "Empresa",
};

export const ACAO_LABEL: Record<string, string> = {
  insert: "Criação",
  update: "Edição",
  delete: "Exclusão",
};

export type Diferenca = { campo: string; de: unknown; para: unknown };

/** Compara dados_anteriores e dados_novos e retorna só os campos que mudaram. */
export function calcularDiferencas(
  anterior: Record<string, unknown> | null,
  novo: Record<string, unknown> | null
): Diferenca[] {
  if (!anterior || !novo) return [];
  const campos = new Set([...Object.keys(anterior), ...Object.keys(novo)]);
  const diffs: Diferenca[] = [];
  for (const campo of campos) {
    const de = anterior[campo];
    const para = novo[campo];
    if (JSON.stringify(de) !== JSON.stringify(para)) {
      diffs.push({ campo, de, para });
    }
  }
  return diffs.sort((a, b) => a.campo.localeCompare(b.campo));
}

export function formatarValor(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
