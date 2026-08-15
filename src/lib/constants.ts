export const OBRA_STATUS = [
  { value: "lead", label: "Lead" },
  { value: "visita_agendada", label: "Visita agendada" },
  { value: "medicao_realizada", label: "Medição realizada" },
  { value: "projeto_em_elaboracao", label: "Projeto em elaboração" },
  { value: "orcamento_enviado", label: "Orçamento enviado" },
  { value: "aprovado", label: "Aprovado" },
  { value: "em_producao", label: "Em produção" },
  { value: "aguardando_material", label: "Aguardando material" },
  { value: "instalacao_agendada", label: "Instalação agendada" },
  { value: "instalado", label: "Instalado" },
  { value: "finalizado", label: "Finalizado" },
  { value: "garantia", label: "Garantia" },
] as const;

export const AMBIENTE_TIPOS = [
  { value: "banheiro", label: "Banheiro" },
  { value: "varanda", label: "Varanda" },
  { value: "cozinha", label: "Cozinha" },
  { value: "quarto", label: "Quarto" },
  { value: "sala", label: "Sala" },
  { value: "fachada", label: "Fachada" },
  { value: "area_externa", label: "Área externa" },
  { value: "personalizado", label: "Personalizado" },
] as const;

export const SISTEMA_TIPOS = [
  { value: "box", label: "Box" },
  { value: "sacada", label: "Sacada" },
  { value: "porta", label: "Porta" },
  { value: "janela", label: "Janela" },
  { value: "espelho", label: "Espelho" },
  { value: "divisoria", label: "Divisória" },
  { value: "guarda_corpo", label: "Guarda-corpo" },
  { value: "cobertura", label: "Cobertura" },
  { value: "esquadria", label: "Esquadria" },
  { value: "serralheria", label: "Serralheria" },
  { value: "personalizado", label: "Personalizado" },
] as const;

export const ETAPAS_PRODUCAO = [
  { value: "aprovado", label: "Aprovado" },
  { value: "aguardando_material", label: "Aguardando material" },
  { value: "em_producao", label: "Em produção" },
  { value: "instalacao_agendada", label: "Instalação agendada" },
  { value: "instalado", label: "Instalado" },
] as const;

export const TIPO_VIDRO_OPCOES = [
  { value: "incolor", label: "Incolor" },
  { value: "verde", label: "Verde" },
  { value: "fume", label: "Fumê" },
  { value: "bronze", label: "Bronze" },
  { value: "refletivo", label: "Refletivo" },
  { value: "laminado", label: "Laminado" },
  { value: "serigrafado", label: "Serigrafado" },
  { value: "espelho", label: "Espelho" },
  { value: "outro", label: "Outro" },
] as const;

export const ITEM_CATEGORIAS = [
  { value: "vidro", label: "Vidro" },
  { value: "perfil", label: "Perfil" },
  { value: "kit", label: "Kit" },
  { value: "ferragem", label: "Ferragem" },
  { value: "acessorio", label: "Acessório" },
  { value: "silicone", label: "Silicone" },
  { value: "epi", label: "EPI" },
  { value: "outro", label: "Outro" },
] as const;

export const ORCAMENTO_STATUS = [
  { value: "rascunho", label: "Rascunho" },
  { value: "aguardando_aprovacao", label: "Aguardando aprovação interna" },
  { value: "enviado", label: "Enviado ao cliente" },
  { value: "visualizado", label: "Visualizado pelo cliente" },
  { value: "aprovado", label: "Aprovado" },
  { value: "recusado", label: "Recusado" },
  { value: "vencido", label: "Vencido" },
  { value: "cancelado", label: "Cancelado" },
] as const;

export const ORCAMENTO_TRANSICOES: Record<string, string[]> = {
  rascunho: ["aguardando_aprovacao", "enviado", "cancelado"],
  aguardando_aprovacao: ["enviado", "cancelado"],
  enviado: ["visualizado", "aprovado", "recusado", "cancelado"],
  visualizado: ["aprovado", "recusado", "cancelado"],
  aprovado: [],
  recusado: ["rascunho"],
  vencido: ["rascunho"],
  cancelado: [],
};

export const PARAMETROS_BOX_DEFINICAO = [
  { chave: "desconto_lateral_mm", descricao: "Desconto lateral (cada lado)", padrao: 4 },
  { chave: "transpasse_mm", descricao: "Transpasse entre folhas", padrao: 25 },
  { chave: "folga_altura_mm", descricao: "Folga de altura (trilho/soleira)", padrao: 10 },
  { chave: "coeficiente_peso", descricao: "Coeficiente de peso do vidro", padrao: 2.5 },
] as const;

export const PARAMETROS_SACADA_DEFINICAO = [
  { chave: "desconto_cantoneira_mm", descricao: "Desconto de cantoneira (cada extremidade)", padrao: 10 },
  { chave: "desconto_guarnicao_mm", descricao: "Desconto de guarnição lateral", padrao: 3 },
  { chave: "desconto_altura_mm", descricao: "Desconto de altura (trilho superior/inferior)", padrao: 165 },
  { chave: "desconto_leito_mm", descricao: "Desconto do leito de colagem", padrao: 2 },
  { chave: "usinagem_recuo_mm", descricao: "Recuo da usinagem de saída", padrao: 20 },
  { chave: "usinagem_comprimento_mm", descricao: "Comprimento da usinagem de saída", padrao: 30 },
  { chave: "coeficiente_peso", descricao: "Coeficiente de peso do vidro", padrao: 2.5 },
] as const;

export const PARAMETROS_PORTA_DEFINICAO = [
  { chave: "folga_lateral_mm", descricao: "Folga lateral (cada lado, encaixe no marco)", padrao: 5 },
  { chave: "folga_altura_mm", descricao: "Folga de altura (piso/verga)", padrao: 10 },
  { chave: "distancia_dobradica_borda_mm", descricao: "Distância da dobradiça até a borda", padrao: 150 },
  { chave: "transpasse_correr_mm", descricao: "Transpasse do painel de correr sobre o vão", padrao: 40 },
  { chave: "coeficiente_peso", descricao: "Coeficiente de peso do vidro", padrao: 2.5 },
] as const;

export const PARAMETROS_JANELA_DEFINICAO = [
  { chave: "desconto_lateral_mm", descricao: "Desconto lateral (cada lado, encaixe no marco)", padrao: 4 },
  { chave: "desconto_altura_mm", descricao: "Desconto de altura (marco superior/inferior)", padrao: 8 },
  { chave: "transpasse_mm", descricao: "Transpasse entre folhas (só janela de correr)", padrao: 25 },
  { chave: "coeficiente_peso", descricao: "Coeficiente de peso do vidro", padrao: 2.5 },
] as const;

export const PARAMETROS_DEFINICAO_POR_TIPO: Record<
  string,
  readonly { chave: string; descricao: string; padrao: number }[]
> = {
  box: PARAMETROS_BOX_DEFINICAO,
  sacada: PARAMETROS_SACADA_DEFINICAO,
  porta: PARAMETROS_PORTA_DEFINICAO,
  janela: PARAMETROS_JANELA_DEFINICAO,
};

export const MOVIMENTACAO_TIPOS = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "devolucao", label: "Devolução" },
  { value: "perda", label: "Perda" },
  { value: "quebra", label: "Quebra" },
  { value: "consumo", label: "Consumo" },
  { value: "ajuste", label: "Ajuste" },
] as const;
