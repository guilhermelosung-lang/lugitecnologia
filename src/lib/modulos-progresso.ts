export type ModuloProgresso = {
  numero: number;
  nome: string;
  telas: boolean;
  banco: boolean;
  regras: boolean;
  integracoes: boolean;
  testes: boolean;
  pendencias: string;
};

function naoIniciado(numero: number, nome: string): ModuloProgresso {
  return {
    numero,
    nome,
    telas: false,
    banco: false,
    regras: false,
    integracoes: false,
    testes: false,
    pendencias: "Não iniciado.",
  };
}

export const MODULOS_PROGRESSO: ModuloProgresso[] = [
  {
    numero: 1,
    nome: "Dashboard Geral",
    telas: true,
    banco: true,
    regras: false,
    integracoes: false,
    testes: false,
    pendencias:
      "Faltam gráficos, filtros (período/filial/vendedor/status), atalhos completos e os cards que dependem de orçamentos, obras, produção, estoque e financeiro (ainda não existem).",
  },
  {
    numero: 2,
    nome: "Empresas, Filiais e Configurações",
    telas: true,
    banco: true,
    regras: true,
    integracoes: false,
    testes: false,
    pendencias:
      "A tabela de filiais já existe no banco, mas falta a tela de cadastro/edição de filiais e a opção de cada filial usar configuração própria.",
  },
  {
    numero: 3,
    nome: "Usuários e Permissões",
    telas: true,
    banco: true,
    regras: true,
    integracoes: false,
    testes: false,
    pendencias:
      "Faltam: criação de perfis personalizados pela interface (hoje só os 12 perfis padrão existem), tela de edição fina de permissões por perfil, e visualização do histórico de auditoria.",
  },
  {
    numero: 4,
    nome: "Planos e Assinaturas",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Catálogo de 3 planos (Starter, Profissional, Empresarial) com limites reais de usuários/obras por mês. Toda empresa nova criada via cadastro (bootstrap_empresa) entra automaticamente em teste grátis de 7 dias no plano Profissional (plano_status='trial', plano_expira_em = data do cadastro + 7 dias) — banner real no topo do sistema e na tela de Planos mostra os dias restantes (ou aviso de teste expirado) calculado a partir da data real gravada no banco. Depois do trial, ou a qualquer momento, o status (ativo/inadimplente/cancelado/sem plano) é controlado manualmente — sem gateway de pagamento integrado, por decisão consciente (nenhuma chave de API real foi configurada). Alerta real quando a empresa está usando mais usuários/obras do que o limite do plano contratado. Falta: cobrança automática de verdade (Stripe ou similar) se decidirem integrar depois, e bloqueio automático de funcionalidades quando o plano expira (hoje é aviso visual, não bloqueio de acesso).",
  },
  {
    numero: 5,
    nome: "Clientes",
    telas: true,
    banco: true,
    regras: true,
    integracoes: false,
    testes: false,
    pendencias:
      "Faltam anexos/fotos do cliente e o vínculo com obras, orçamentos e contratos (módulos ainda não construídos).",
  },
  {
    numero: 6,
    nome: "Obras e Ambientes",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Falta anexar fotos/vídeos da obra e vincular a medições e orçamentos (ainda não existem). Já integra com Clientes (atalho \"Nova obra\" no cliente).",
  },
  {
    numero: 7,
    nome: "Medição Digital",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Captura estruturada de medidas por ambiente (vão, diagonal, nível, prumo), embutida na própria tela da obra. Checagem de esquadro real: compara as duas diagonais do vão (geometria — as diagonais de um retângulo verdadeiro são iguais) e avisa quando a diferença passa de 5mm, com o vão marcado como fora de esquadro. Falta: anexar foto da medição (reaproveitando o módulo de Documentos, ainda não integrado aqui) e captura via celular com câmera/AR.",
  },
  {
    numero: 8,
    nome: "Catálogo de Sistemas e Kits",
    telas: true,
    banco: true,
    regras: false,
    integracoes: false,
    testes: false,
    pendencias:
      "Cadastro de sistemas, kits e itens do kit funciona, com parâmetros de cálculo por kit. Falta o vínculo com orçamentos/pedidos (ainda não existem).",
  },
  {
    numero: 9,
    nome: "Motor de Regras e Fórmulas",
    telas: true,
    banco: true,
    regras: true,
    integracoes: false,
    testes: false,
    pendencias:
      "Implementado como parâmetros numéricos configuráveis por kit (desconto lateral, transpasse, folga, coeficiente de peso), com snapshot salvo em cada cálculo — não uma linguagem de fórmulas genérica. Ainda só é usado pela calculadora de Box.",
  },
  {
    numero: 10,
    nome: "Configurador Visual",
    telas: true,
    banco: false,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Reaproveita os desenhos técnicos já gerados por cada calculadora (box, sacada reta/L/U, porta, janela) num visualizador único — escolhe o tipo e o cálculo salvo e vê o desenho em tamanho maior. Não é um configurador de arrastar-e-soltar do zero (não gera dado novo, por isso não tem banco próprio). Falta: edição ao vivo (mudar uma medida e ver o desenho atualizar antes de salvar) e exportar o desenho como imagem/PDF.",
  },
  {
    numero: 11,
    nome: "Ponto de Abertura",
    telas: true,
    banco: true,
    regras: false,
    integracoes: false,
    testes: false,
    pendencias:
      "Lado e tipo de abertura padrão configuráveis por kit, salvos de verdade no cadastro do kit (Catálogo). Falta a parte que dá mais valor: pré-selecionar automaticamente esse padrão nos formulários de cálculo (sacada, box, porta) quando o kit é escolhido — hoje o campo é só uma referência salva no kit, sem propagar pra frente.",
  },
  {
    numero: 12,
    nome: "Calculadora de Sacada Sem Roldanas",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Reta, L e U funcionando de verdade: cada segmento calculado separadamente (nunca somando os vãos), com alternativas de quantidade de painéis (recomendada, menos vidros, mais vidros) dentro da faixa de 450–600mm, desconto de cantoneira só nas pontas que encostam na parede, altura por 3 pontos (usa a média quando a diferença passa de 30mm, conferido contra a apostila oficial do fabricante), leito, usinagem de saída, peso, conferência inversa do vão (verde/amarelo/vermelho), desenho em planta com canto(s) e seta de abertura, lista para têmpera e bloqueio de liberação quando há pendência. Ainda faltam: segmentos com mais de 3 lados, abertura central/bilateral com posição automática de usinagem, distribuição de diferença entre painéis de larguras diferentes, e a distinção entre painel fixo e deslizante (hoje todos são tratados como deslizantes).",
  },
  {
    numero: 13,
    nome: "Calculadora de Box",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Só o tipo \"frontal de correr\" (2 folhas) está pronto, com desenho técnico, lista de vidros/perfis/acessórios, peso e passo a passo do cálculo. Faltam canto, abrir, pivotante, camarão, até o teto etc. Já integra com Obras e Catálogo.",
  },
  {
    numero: 14,
    nome: "Calculadora de Portas e Janelas de Vidro",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Portas: de abrir, pivotante, de correr e com fixo lateral funcionam de verdade (furos, ferragens, peso). Janelas: fixa e de correr (2 folhas) funcionam. Faltam: porta com bandeira, basculante, maxim-ar e veneziana — essas exigem dados de mecanismo de abertura que não temos como verificar sem inventar números, então preferimos deixar de fora a implementar algo não confiável.",
  },
  {
    numero: 15,
    nome: "Espelhos, Tampos e Prateleiras",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Calculadora avulsa de painel plano retangular: área, perímetro de borda, peso (mesma fórmula validada) e furos de fixação informados pelo profissional. Falta: formatos não retangulares (meia-lua, oval) e recorte com nicho — exigiriam geometria mais complexa que não faz parte do escopo atual.",
  },
  {
    numero: 16,
    nome: "Esquadrias de Alumínio",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Por decisão do usuário: sem calculadora automática (categoria ampla demais sem uma fórmula única validada, ao contrário de box/sacada/porta/janela que tinham fonte técnica verificada). Cadastro real de projeto/item ligado à obra, com especificação, material, cor, quantidade, valor estimado e status (orçamento → aprovado → em produção → instalado). Compartilha tela com Serralheria (módulo 17).",
  },
  {
    numero: 17,
    nome: "Serralheria",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Mesma tela e mesma tabela do módulo 16 (Esquadrias de Alumínio), filtrando pela categoria \"serralheria\" — por decisão do usuário, sem calculadora automática pelo mesmo motivo.",
  },
  {
    numero: 18,
    nome: "Peso e Segurança do Vidro",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Calculadora avulsa (não precisa de kit/sistema) reaproveitando a mesma fórmula de peso já validada nas outras calculadoras, com alerta de manuseio e recomendação de quantas pessoas usar — usando os mesmos limiares de 25kg/40kg já aplicados no resto do sistema. Não afirma conformidade com NBR 7199 ou outra norma técnica porque não temos o texto da norma verificado — seria fabricar segurança, não calculá-la.",
  },
  {
    numero: 19,
    nome: "Beneficiamentos, Furos e Recortes",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Catálogo real de tipos de beneficiamento (furo, recorte, lapidação, chanfro, polimento) com preço opcional, e registro de onde cada um foi aplicado (obra + peça/local + quantidade). Não calcula posição exata de furo/recorte automaticamente porque isso depende da ficha técnica de cada acessório/fabricante, que varia e não temos como verificar de forma genérica — mesmo critério já usado em outras calculadoras. Falta: vincular o registro a uma peça específica de um cálculo técnico (hoje é texto livre) e editor visual de posição.",
  },
  {
    numero: 20,
    nome: "Fornecedores e Têmperas",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Cadastro completo de fornecedores funciona. Tabela de preços de vidro por tipo/cor/espessura (+ custo de têmpera + margem padrão) funciona e já alimenta a precificação automática dos Orçamentos (módulo 26). Falta: importação de Excel/CSV e vínculo com pedidos de têmpera (módulo 22, ainda não existe).",
  },
  {
    numero: 21,
    nome: "Comparador de Fornecedores",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Agrupa a tabela de preços de vidro por tipo+cor+espessura e ordena por custo total real (vidro+têmpera), marcando o mais barato de cada combinação. 100% em cima de dados já cadastrados, nada inventado. Falta: comparar também prazo de entrega e condições de pagamento do fornecedor (dados já existem no cadastro de fornecedor, ainda não cruzados aqui).",
  },
  {
    numero: 22,
    nome: "Pedidos para Têmpera",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Gera pedido de verdade a partir de TODOS os cálculos técnicos (box, sacada, porta, janela) já feitos pra obra, extraindo cada peça de vidro real (mesmo motor usado na precificação automática do orçamento). Numeração automática por empresa, vínculo com fornecedor, status. Falta: exportar PDF do pedido pro fornecedor e reenvio de peça recusada.",
  },
  {
    numero: 23,
    nome: "Recebimento e Conferência",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Checklist real dentro do próprio Pedido de Têmpera: marcar cada peça como recebida, data de recebimento automática, e o status do pedido muda sozinho entre enviado/recebido parcialmente/recebido conforme os itens vão sendo conferidos. Falta: registrar avaria/quebra por peça (hoje só recebido sim/não) e conferência por foto.",
  },
  {
    numero: 24,
    nome: "Plano de Corte de Vidro",
    telas: true,
    banco: true,
    regras: true,
    integracoes: false,
    testes: false,
    pendencias:
      "Empacotamento 2D real (algoritmo de prateleiras — bin-packing por geometria, não uma fórmula do setor) das peças dentro de chapas, calculando quantas chapas são necessárias e o aproveitamento real de cada uma, com desenho de cada chapa. Entrada hoje é uma lista de peças colada manualmente (código;largura;altura;quantidade). Falta: importar peças direto de um cálculo técnico ou pedido de têmpera (ainda é manual), e um algoritmo guilhotina mais eficiente que prateleiras simples.",
  },
  {
    numero: 25,
    nome: "Plano de Corte de Perfis",
    telas: true,
    banco: true,
    regras: true,
    integracoes: false,
    testes: false,
    pendencias:
      "Empacotamento 1D real (first-fit-decreasing) das peças dentro de barras, calculando barras necessárias e sobra de cada uma, com desenho de cada barra. Entrada hoje é uma lista colada manualmente (código;comprimento;quantidade). Falta: importar peças direto da lista de perfis de um cálculo técnico (a informação já existe no resultado de cada calculadora, só falta o botão de importar).",
  },
  {
    numero: 26,
    nome: "Orçamentos",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Numeração automática, itens manuais ou vidro precificado automaticamente (vincula a um cálculo de box/sacada/porta/janela + um preço da tabela de vidros por tipo/cor/espessura+têmpera, calcula a área real do cálculo e preenche custo e preço sozinho), custo/preço/margem calculados de verdade, permissões (custos.visualizar/margem.visualizar/desconto.conceder/desconto.aprovar) e trava real de desconto abaixo da margem mínima da empresa. Fluxo de status rascunho→aprovado funciona. Falta: precificação automática de perfis/acessórios (só o vidro é automático hoje), aprovação pública por link/assinatura do cliente, e gerar pedido de têmpera + reserva de estoque ao aprovar (módulos 22 e 29 ainda não conectados).",
  },
  {
    numero: 27,
    nome: "PDF, Contrato e Aprovação",
    telas: true,
    banco: false,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Geração de PDF real (dados da empresa, cliente, obra, itens, valores, desconto, garantia) funcionando via botão \"Baixar PDF\". Falta: logotipo da empresa, contrato/termos completos, aprovação online por link público com assinatura do cliente, e modelos alternativos (resumido, com desenho).",
  },
  {
    numero: 28,
    nome: "Produção",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Kanban real com 5 etapas (aprovado → aguardando material → em produção → instalação agendada → instalado), reaproveitando o campo obras.status já existente — não duplica dado nem cria uma máquina de estados paralela. Avançar/voltar etapa com um clique. Falta: rastrear item por item do orçamento (hoje a etapa é da obra inteira) e tempo médio por etapa.",
  },
  {
    numero: 29,
    nome: "Estoque",
    telas: true,
    banco: true,
    regras: true,
    integracoes: false,
    testes: false,
    pendencias:
      "Itens, movimentações (entrada/saída/perda/ajuste) e saldo automático via trigger já funcionam de verdade. Falta reserva automática ao aprovar orçamento e consumo automático pela produção (módulos ainda não existem).",
  },
  {
    numero: 30,
    nome: "Agenda e Instalações",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Agendamento real (medição, instalação, visita técnica, manutenção) vinculado a uma obra, com responsável, data/hora de início e fim, lista agrupada por dia, concluir (permissão instalacao.concluir) e cancelar. Falta: visão de calendário mensal/semanal (hoje é lista cronológica), detectar conflito de horário do mesmo responsável e notificação/lembrete.",
  },
  {
    numero: 31,
    nome: "Garantia e Pós-venda",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Abertura de chamado (garantia/assistência/reclamação) vinculado a uma obra real, com prioridade, fluxo de status (aberto → em atendimento → resolvido/cancelado) e descrição obrigatória da resolução ao fechar. Filtro por status/tipo. Falta: cálculo automático de \"ainda está na garantia?\" (não existe uma data de instalação/entrega registrada na obra hoje para comparar com o prazo de garantia da empresa), notificação ao cliente e vínculo com o card de chamados na tela da própria obra.",
  },
  {
    numero: 32,
    nome: "Financeiro",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Contas a receber e a pagar de verdade. Trigger no banco gera automaticamente uma conta a receber (valor real do orçamento com desconto já aplicado) sempre que um orçamento muda pra status aprovado — sem duplicar se o status oscilar. Lançamentos manuais para fornecedor/despesa fixa/salário/frete/outro, marcar como pago com data real, reabrir, excluir, cards de resumo (a receber, a pagar, atrasado, movimentado) calculados a partir dos lançamentos reais. Falta: conciliação bancária, parcelamento de um lançamento em várias parcelas, e relatório de fluxo de caixa projetado.",
  },
  {
    numero: 33,
    nome: "Relatórios",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Painel com dados reais dos últimos 6 meses: orçamentos e valor orçado/aprovado por mês, taxa de conversão real (aprovados sobre não cancelados), clientes novos por mês, orçamentos por status com contagem e valor, cálculos técnicos por tipo. Nenhum número inventado — tudo calculado on-the-fly a partir de orcamentos/orcamento_itens/clientes/cálculos. Falta: exportar em PDF/Excel, período customizável (hoje é fixo em 6 meses) e relatórios de produção/estoque/financeiro dedicados.",
  },
  {
    numero: 34,
    nome: "Documentos e Arquivos",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Upload/download/exclusão real de arquivos (até 20MB) via Supabase Storage privado (bucket isolado por empresa via RLS no próprio Storage), com URL assinada de 1h pra download. Já integrado em Obras, Clientes, Fornecedores e Orçamentos. Falta: preview de imagem/PDF inline (hoje abre em nova aba), categorização por tipo de documento e versionamento.",
  },
  {
    numero: 35,
    nome: "Auditoria",
    telas: true,
    banco: true,
    regras: true,
    integracoes: true,
    testes: false,
    pendencias:
      "Trigger de banco grava criação/edição/exclusão automaticamente (não dá pra burlar pela aplicação) em clientes, obras, ambientes, orçamentos e itens, fornecedores, catálogo (sistemas/kits/itens/parâmetros), cálculos técnicos, estoque, preços de vidro, usuários e empresa. Tela com filtro por área/ação/usuário, paginação e diff campo a campo (o que mudou de → para) para edições. Falta cobrir tabelas de configuração menos críticas (perfis/permissões/convites/filiais) e exportar para CSV.",
  },
  naoIniciado(36, "Assistente de Inteligência Artificial"),
];

export function percentualModulo(m: ModuloProgresso) {
  const pontos = [m.telas, m.banco, m.regras, m.integracoes, m.testes].filter(
    Boolean
  ).length;
  return Math.round((pontos / 5) * 100);
}
