import { renderToBuffer } from "@react-pdf/renderer";
import { getCurrentUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { OrcamentoPdfDocument } from "@/lib/pdf/orcamento-document";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getCurrentUsuario();
  if (!context) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: orcamento } = await supabase
    .from("orcamentos")
    .select("*, obras(nome, endereco, clientes(nome, cpf_cnpj, telefone, email))")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!orcamento || !orcamento.obras) {
    return new Response("Orçamento não encontrado.", { status: 404 });
  }

  const { data: itens } = await supabase
    .from("orcamento_itens")
    .select("descricao, quantidade, unidade, preco_unitario")
    .eq("orcamento_id", id)
    .order("created_at");

  const buffer = await renderToBuffer(
    OrcamentoPdfDocument({
      empresa: context.empresa,
      orcamento,
      obra: { nome: orcamento.obras.nome, endereco: orcamento.obras.endereco },
      cliente: orcamento.obras.clientes ?? { nome: "Cliente", cpf_cnpj: null, telefone: null, email: null },
      itens: itens ?? [],
    })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="orcamento-${orcamento.numero}.pdf"`,
    },
  });
}
