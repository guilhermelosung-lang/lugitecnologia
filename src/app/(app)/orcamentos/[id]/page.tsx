import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ItensPanel } from "@/components/orcamentos/itens-panel";
import { ResumoPanel } from "@/components/orcamentos/resumo-panel";
import { StatusPanel } from "@/components/orcamentos/status-panel";
import { AnexosPanel } from "@/components/documentos/anexos-panel";
import { buscarAnexos } from "@/lib/documentos/buscar";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export default async function OrcamentoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: orcamento } = await supabase
    .from("orcamentos")
    .select("*, obras(id, nome, clientes(id, nome))")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!orcamento) notFound();

  const [
    { data: itens },
    { data: calculosBox },
    { data: calculosSacada },
    { data: calculosPorta },
    { data: calculosJanela },
    { data: precosVidro },
    anexos,
  ] = await Promise.all([
    supabase.from("orcamento_itens").select("*").eq("orcamento_id", id).order("created_at"),
    supabase.from("calculos_box").select("id, nome, resultado").eq("obra_id", orcamento.obra_id),
    supabase.from("calculos_sacada").select("id, nome, resultado").eq("obra_id", orcamento.obra_id),
    supabase.from("calculos_porta").select("id, nome, resultado, espessura_mm").eq("obra_id", orcamento.obra_id),
    supabase.from("calculos_janela").select("id, nome, resultado, espessura_mm").eq("obra_id", orcamento.obra_id),
    supabase
      .from("tabela_precos_vidro")
      .select("*, fornecedores(nome)")
      .eq("empresa_id", context.empresa.id)
      .eq("ativo", true)
      .is("deleted_at", null),
    buscarAnexos(supabase, context.empresa.id, "orcamento", id),
  ]);

  const podeEditar = hasPermissao(context, "orcamentos.gerenciar");
  const podeVerCusto = hasPermissao(context, "custos.visualizar");
  const podeVerMargem = hasPermissao(context, "margem.visualizar");
  const podeConcederDesconto = hasPermissao(context, "desconto.conceder");

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            <Link href={`/obras/${orcamento.obra_id}`} className="text-accent-dark hover:underline">
              {orcamento.obras?.nome}
            </Link>
            {orcamento.obras?.clientes?.nome ? ` · ${orcamento.obras.clientes.nome}` : ""}
          </p>
          <h1 className="font-heading text-2xl font-bold text-primary">Orçamento #{orcamento.numero}</h1>
          <p className="text-sm text-muted">
            Criado em {formatDateTime(orcamento.created_at)} · válido até {orcamento.data_validade ?? "—"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <a href={`/api/orcamentos/${orcamento.id}/pdf`} target="_blank" rel="noopener">
            <Button variant="secondary" className="px-3 py-1.5 text-xs">Baixar PDF</Button>
          </a>
          <StatusPanel orcamentoId={orcamento.id} status={orcamento.status} podeEditar={podeEditar} />
        </div>
      </div>

      <ItensPanel
        orcamentoId={orcamento.id}
        itens={itens ?? []}
        calculosBox={calculosBox ?? []}
        calculosSacada={calculosSacada ?? []}
        calculosPorta={calculosPorta ?? []}
        calculosJanela={calculosJanela ?? []}
        precosVidro={precosVidro ?? []}
        podeEditar={podeEditar}
        podeVerCusto={podeVerCusto}
      />

      <ResumoPanel
        orcamentoId={orcamento.id}
        itens={itens ?? []}
        descontoPercentual={orcamento.desconto_percentual}
        descontoValor={orcamento.desconto_valor}
        podeVerCusto={podeVerCusto}
        podeVerMargem={podeVerMargem}
        podeConcederDesconto={podeConcederDesconto}
      />

      <AnexosPanel
        entidadeTipo="orcamento"
        entidadeId={orcamento.id}
        caminhoRevalidar={`/orcamentos/${orcamento.id}`}
        documentos={anexos}
        podeEditar={podeEditar}
      />
    </div>
  );
}
