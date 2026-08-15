import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ORCAMENTO_STATUS } from "@/lib/constants";

const STATUS_LABEL = Object.fromEntries(ORCAMENTO_STATUS.map((s) => [s.value, s.label]));

const cor = {
  primary: "#2B1364",
  accent: "#9333EA",
  muted: "#6C6588",
  border: "#E8E0F7",
  bg: "#F8F5FE",
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1E1145" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: `2px solid ${cor.accent}`,
    paddingBottom: 14,
    marginBottom: 18,
  },
  empresaNome: { fontSize: 16, fontFamily: "Helvetica-Bold", color: cor.primary },
  small: { fontSize: 9, color: cor.muted, marginTop: 2 },
  orcamentoTitulo: { fontSize: 14, fontFamily: "Helvetica-Bold", color: cor.accent, textAlign: "right" },
  statusBadge: {
    fontSize: 9,
    color: cor.accent,
    textAlign: "right",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: cor.primary,
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  box: {
    backgroundColor: cor.bg,
    borderRadius: 4,
    padding: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  col: { flexDirection: "column" },
  label: { fontSize: 8, color: cor.muted, marginBottom: 1 },
  value: { fontSize: 10, color: "#1E1145", marginBottom: 6 },
  table: { marginTop: 6 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: cor.primary,
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${cor.border}`,
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontSize: 9,
  },
  cellDescricao: { flex: 3 },
  cellQtd: { flex: 1, textAlign: "right" },
  cellPreco: { flex: 1.2, textAlign: "right" },
  cellTotal: { flex: 1.2, textAlign: "right" },
  totaisBox: {
    marginTop: 14,
    alignSelf: "flex-end",
    width: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontSize: 10,
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `1px solid ${cor.border}`,
    marginTop: 4,
    paddingTop: 6,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: cor.primary,
  },
  paragrafo: { fontSize: 9, color: "#1E1145", lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: cor.muted,
    textAlign: "center",
    borderTop: `1px solid ${cor.border}`,
    paddingTop: 8,
  },
});

export type OrcamentoPdfProps = {
  empresa: {
    razao_social: string;
    nome_fantasia: string | null;
    cpf_cnpj: string;
    telefone: string | null;
    whatsapp: string | null;
    email: string | null;
    endereco: string | null;
    cidade: string | null;
    estado: string | null;
    chave_pix: string | null;
    texto_garantia: string | null;
    garantia_padrao_meses: number;
  };
  orcamento: {
    numero: number;
    status: string;
    data_validade: string | null;
    condicoes_pagamento: string | null;
    observacoes: string | null;
    desconto_percentual: number;
    desconto_valor: number;
    created_at: string;
  };
  obra: { nome: string; endereco: string | null };
  cliente: { nome: string; cpf_cnpj: string | null; telefone: string | null; email: string | null };
  itens: { descricao: string; quantidade: number; unidade: string; preco_unitario: number }[];
};

function formatarData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso));
}
function formatarMoeda(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

export function OrcamentoPdfDocument({ empresa, orcamento, obra, cliente, itens }: OrcamentoPdfProps) {
  const subtotal = itens.reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0);
  const descontoTotal = orcamento.desconto_valor + (subtotal * orcamento.desconto_percentual) / 100;
  const total = Math.max(subtotal - descontoTotal, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.empresaNome}>{empresa.nome_fantasia || empresa.razao_social}</Text>
            <Text style={styles.small}>{empresa.razao_social} · CNPJ/CPF {empresa.cpf_cnpj}</Text>
            <Text style={styles.small}>
              {[empresa.endereco, empresa.cidade, empresa.estado].filter(Boolean).join(", ")}
            </Text>
            <Text style={styles.small}>
              {[empresa.telefone, empresa.whatsapp, empresa.email].filter(Boolean).join(" · ")}
            </Text>
          </View>
          <View>
            <Text style={styles.orcamentoTitulo}>Orçamento #{orcamento.numero}</Text>
            <Text style={styles.small}>Emitido em {formatarData(orcamento.created_at)}</Text>
            {orcamento.data_validade && (
              <Text style={styles.small}>Válido até {formatarData(orcamento.data_validade)}</Text>
            )}
            <Text style={styles.statusBadge}>{STATUS_LABEL[orcamento.status] ?? orcamento.status}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cliente e obra</Text>
        <View style={[styles.box, styles.row]}>
          <View style={styles.col}>
            <Text style={styles.label}>Cliente</Text>
            <Text style={styles.value}>{cliente.nome}</Text>
            {cliente.cpf_cnpj && (
              <>
                <Text style={styles.label}>CPF/CNPJ</Text>
                <Text style={styles.value}>{cliente.cpf_cnpj}</Text>
              </>
            )}
            {(cliente.telefone || cliente.email) && (
              <>
                <Text style={styles.label}>Contato</Text>
                <Text style={styles.value}>
                  {[cliente.telefone, cliente.email].filter(Boolean).join(" · ")}
                </Text>
              </>
            )}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Obra</Text>
            <Text style={styles.value}>{obra.nome}</Text>
            {obra.endereco && (
              <>
                <Text style={styles.label}>Endereço</Text>
                <Text style={styles.value}>{obra.endereco}</Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Itens</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.cellDescricao}>Descrição</Text>
            <Text style={styles.cellQtd}>Qtd.</Text>
            <Text style={styles.cellPreco}>Preço unit.</Text>
            <Text style={styles.cellTotal}>Total</Text>
          </View>
          {itens.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.cellDescricao}>{item.descricao}</Text>
              <Text style={styles.cellQtd}>{item.quantidade} {item.unidade}</Text>
              <Text style={styles.cellPreco}>{formatarMoeda(item.preco_unitario)}</Text>
              <Text style={styles.cellTotal}>{formatarMoeda(item.quantidade * item.preco_unitario)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totaisBox}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatarMoeda(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Desconto</Text>
            <Text>− {formatarMoeda(descontoTotal)}</Text>
          </View>
          <View style={styles.totalFinalRow}>
            <Text>Total</Text>
            <Text>{formatarMoeda(total)}</Text>
          </View>
        </View>

        {orcamento.condicoes_pagamento && (
          <>
            <Text style={styles.sectionTitle}>Condições de pagamento</Text>
            <Text style={styles.paragrafo}>{orcamento.condicoes_pagamento}</Text>
          </>
        )}

        {(empresa.texto_garantia || empresa.garantia_padrao_meses) && (
          <>
            <Text style={styles.sectionTitle}>Garantia</Text>
            <Text style={styles.paragrafo}>
              {empresa.texto_garantia ||
                `Garantia de ${empresa.garantia_padrao_meses} meses contra defeitos de fabricação e instalação.`}
            </Text>
          </>
        )}

        {orcamento.observacoes && (
          <>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.paragrafo}>{orcamento.observacoes}</Text>
          </>
        )}

        {empresa.chave_pix && (
          <>
            <Text style={styles.sectionTitle}>Pagamento via Pix</Text>
            <Text style={styles.paragrafo}>Chave: {empresa.chave_pix}</Text>
          </>
        )}

        <Text style={styles.footer} fixed>
          {empresa.nome_fantasia || empresa.razao_social} · Este orçamento não substitui projeto
          estrutural ou responsabilidade técnica quando aplicável.
        </Text>
      </Page>
    </Document>
  );
}
