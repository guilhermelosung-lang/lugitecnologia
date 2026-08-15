"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { ORCAMENTO_TRANSICOES } from "@/lib/constants";
import { extrairPaineisDoCalculo, areaTotalM2, espessuraDoCalculo, precoCustoM2, precoVendaM2, type TipoCalculo } from "@/lib/calc/vidro-utils";
import type { TablesUpdate } from "@/types/database.types";

const TABELA_POR_TIPO: Record<TipoCalculo, "calculos_box" | "calculos_sacada" | "calculos_porta" | "calculos_janela"> = {
  box: "calculos_box",
  sacada: "calculos_sacada",
  porta: "calculos_porta",
  janela: "calculos_janela",
};


export async function criarOrcamentoAction(obraId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "orcamentos.gerenciar")) {
    throw new Error("Você não tem permissão para criar orçamentos.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orcamentos")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: obraId,
      validade_dias: context.empresa.validade_orcamento_dias,
      condicoes_pagamento: context.empresa.condicoes_comerciais,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/orcamentos");
  redirect(`/orcamentos/${data.id}`);
}

const itemManualSchema = z.object({
  descricao: z.string().trim().min(2, "Informe a descrição do item."),
  quantidade: z.coerce.number().positive("Quantidade deve ser maior que zero."),
  unidade: z.string().trim().min(1).default("un"),
  custo_unitario: z.coerce.number().min(0).default(0),
  preco_unitario: z.coerce.number().min(0).default(0),
  calculo_box_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
});

const itemVidroSchema = z.object({
  descricao: z.string().trim().min(2, "Informe a descrição do item."),
  calculo_tipo: z.enum(["box", "sacada", "porta", "janela"]),
  calculo_id: z.string().uuid("Selecione o cálculo."),
  tabela_preco_vidro_id: z.string().uuid("Selecione o preço de vidro."),
});

export async function adicionarItemOrcamentoAction(orcamentoId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "orcamentos.gerenciar")) {
    throw new Error("Você não tem permissão para editar orçamentos.");
  }

  const raw = Object.fromEntries(formData);
  const supabase = await createClient();

  if (raw.origem === "vidro_calculo") {
    const parsed = itemVidroSchema.safeParse(raw);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
    const dados = parsed.data;

    const { data: orcamento } = await supabase
      .from("orcamentos")
      .select("obra_id")
      .eq("id", orcamentoId)
      .eq("empresa_id", context.empresa.id)
      .maybeSingle();
    if (!orcamento) throw new Error("Orçamento não encontrado.");

    const tabela = TABELA_POR_TIPO[dados.calculo_tipo];
    const { data: calculo } = await supabase
      .from(tabela)
      .select("*")
      .eq("id", dados.calculo_id)
      .eq("empresa_id", context.empresa.id)
      .maybeSingle();
    if (!calculo) throw new Error("Cálculo técnico não encontrado.");
    if (calculo.obra_id !== orcamento.obra_id) {
      throw new Error("Esse cálculo não pertence à obra deste orçamento.");
    }

    const { data: preco } = await supabase
      .from("tabela_precos_vidro")
      .select("*")
      .eq("id", dados.tabela_preco_vidro_id)
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .maybeSingle();
    if (!preco) throw new Error("Preço de vidro não encontrado.");

    const espessuraColuna = "espessura_mm" in calculo ? (calculo as { espessura_mm: number | null }).espessura_mm : null;
    const paineis = extrairPaineisDoCalculo(dados.calculo_tipo, calculo.resultado, espessuraColuna);
    if (paineis.length === 0) throw new Error("Esse cálculo não tem vidros para precificar.");

    const espessuraCalculo = espessuraDoCalculo(paineis);
    if (espessuraCalculo !== preco.espessura_mm) {
      throw new Error(
        `A espessura do preço selecionado (${preco.espessura_mm}mm) não bate com a do cálculo (${espessuraCalculo}mm). Cadastre um preço para ${espessuraCalculo}mm ou escolha outro.`
      );
    }

    const areaM2 = areaTotalM2(paineis);
    const custoUnitario = Math.round(areaM2 * precoCustoM2(preco) * 100) / 100;
    const precoUnitario = Math.round(areaM2 * precoVendaM2(preco) * 100) / 100;

    const base = {
      orcamento_id: orcamentoId,
      empresa_id: context.empresa.id,
      descricao: dados.descricao,
      quantidade: areaM2,
      unidade: "m²",
      custo_unitario: custoUnitario,
      preco_unitario: precoUnitario,
      area_m2: areaM2,
      tabela_preco_vidro_id: preco.id,
    };
    const vinculo =
      dados.calculo_tipo === "box"
        ? { calculo_box_id: calculo.id }
        : dados.calculo_tipo === "sacada"
          ? { calculo_sacada_id: calculo.id }
          : dados.calculo_tipo === "porta"
            ? { calculo_porta_id: calculo.id }
            : { calculo_janela_id: calculo.id };

    const { error } = await supabase.from("orcamento_itens").insert({ ...base, ...vinculo });

    if (error) throw new Error(error.message);
    revalidatePath(`/orcamentos/${orcamentoId}`);
    return;
  }

  const parsed = itemManualSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");

  const { error } = await supabase
    .from("orcamento_itens")
    .insert({ ...parsed.data, orcamento_id: orcamentoId, empresa_id: context.empresa.id });

  if (error) throw new Error(error.message);
  revalidatePath(`/orcamentos/${orcamentoId}`);
}

export async function removerItemOrcamentoAction(itemId: string, orcamentoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "orcamentos.gerenciar")) {
    throw new Error("Você não tem permissão para editar orçamentos.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orcamento_itens")
    .delete()
    .eq("id", itemId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/orcamentos/${orcamentoId}`);
}

const descontoSchema = z.object({
  desconto_percentual: z.coerce.number().min(0).max(100).default(0),
  desconto_valor: z.coerce.number().min(0).default(0),
});

export async function atualizarDescontoAction(orcamentoId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "desconto.conceder")) {
    throw new Error("Você não tem permissão para conceder desconto.");
  }

  const parsed = descontoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Valores de desconto inválidos.");

  const supabase = await createClient();
  const { data: itens } = await supabase
    .from("orcamento_itens")
    .select("quantidade, custo_unitario, preco_unitario")
    .eq("orcamento_id", orcamentoId);

  const subtotalCusto = (itens ?? []).reduce((acc, i) => acc + i.quantidade * i.custo_unitario, 0);
  const subtotalPreco = (itens ?? []).reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0);
  const descontoTotal =
    parsed.data.desconto_valor + (subtotalPreco * parsed.data.desconto_percentual) / 100;
  const precoFinal = Math.max(subtotalPreco - descontoTotal, 0);
  const lucro = precoFinal - subtotalCusto;
  const margemPercentual = precoFinal > 0 ? (lucro / precoFinal) * 100 : 0;

  if (
    context.empresa.margem_minima > 0 &&
    margemPercentual < context.empresa.margem_minima &&
    !hasPermissao(context, "desconto.aprovar")
  ) {
    throw new Error(
      `Esse desconto deixaria a margem em ${margemPercentual.toFixed(1)}%, abaixo do mínimo da empresa (${context.empresa.margem_minima}%). Peça aprovação de um gerente.`
    );
  }

  const supabase2 = await createClient();
  const { error } = await supabase2
    .from("orcamentos")
    .update({
      desconto_percentual: parsed.data.desconto_percentual,
      desconto_valor: parsed.data.desconto_valor,
    })
    .eq("id", orcamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/orcamentos/${orcamentoId}`);
}

export async function atualizarStatusOrcamentoAction(orcamentoId: string, novoStatus: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "orcamentos.gerenciar")) {
    throw new Error("Você não tem permissão para alterar o status do orçamento.");
  }

  const supabase = await createClient();
  const { data: atual } = await supabase
    .from("orcamentos")
    .select("status")
    .eq("id", orcamentoId)
    .eq("empresa_id", context.empresa.id)
    .single();

  if (!atual) throw new Error("Orçamento não encontrado.");

  const permitido = ORCAMENTO_TRANSICOES[atual.status] ?? [];
  if (!permitido.includes(novoStatus)) {
    throw new Error(`Não é possível mudar de "${atual.status}" para "${novoStatus}".`);
  }

  const updateData: TablesUpdate<"orcamentos"> = { status: novoStatus };
  if (novoStatus === "aprovado") {
    updateData.aprovado_em = new Date().toISOString();
    updateData.aprovado_por = context.usuario.id;
  }

  const { error } = await supabase
    .from("orcamentos")
    .update(updateData)
    .eq("id", orcamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/orcamentos/${orcamentoId}`);
  revalidatePath("/orcamentos");
}
