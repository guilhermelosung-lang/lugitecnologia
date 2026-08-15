"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { extrairPaineisDoCalculo, type TipoCalculo } from "@/lib/calc/vidro-utils";
import type { ActionState } from "@/lib/actions/auth";

const TABELA_POR_TIPO: Record<TipoCalculo, "calculos_box" | "calculos_sacada" | "calculos_porta" | "calculos_janela"> = {
  box: "calculos_box",
  sacada: "calculos_sacada",
  porta: "calculos_porta",
  janela: "calculos_janela",
};

const criarPedidoSchema = z.object({
  obra_id: z.string().uuid("Selecione a obra."),
  fornecedor_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

export async function criarPedidoTemperaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "pedido_tempera.gerar")) {
    return { error: "Você não tem permissão para gerar pedidos de têmpera." };
  }

  const parsed = criarPedidoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const supabase = await createClient();

  const tipos: TipoCalculo[] = ["box", "sacada", "porta", "janela"];
  const resultados = await Promise.all(
    tipos.map((tipo) =>
      supabase
        .from(TABELA_POR_TIPO[tipo])
        .select("id, resultado, espessura_mm")
        .eq("obra_id", dados.obra_id)
        .eq("empresa_id", context.empresa.id)
    )
  );

  const itens: {
    codigo: string;
    descricao: string;
    largura_mm: number;
    altura_mm: number;
    espessura_mm: number;
    calculo_tipo: TipoCalculo;
    calculo_id: string;
  }[] = [];

  tipos.forEach((tipo, i) => {
    const calculos = resultados[i].data ?? [];
    for (const calc of calculos) {
      const espessuraColuna = "espessura_mm" in calc ? (calc as { espessura_mm: number | null }).espessura_mm : null;
      const paineis = extrairPaineisDoCalculo(tipo, calc.resultado, espessuraColuna);
      paineis.forEach((p, idx) => {
        itens.push({
          codigo: `${tipo.toUpperCase()}-${calc.id.slice(0, 4)}-${idx + 1}`,
          descricao: `Vidro de ${tipo}`,
          largura_mm: p.larguraMm,
          altura_mm: p.alturaMm,
          espessura_mm: p.espessuraMm,
          calculo_tipo: tipo,
          calculo_id: calc.id,
        });
      });
    }
  });

  if (itens.length === 0) {
    return { error: "Essa obra não tem cálculos técnicos com vidros pra gerar pedido de têmpera." };
  }

  const { data: pedido, error } = await supabase
    .from("pedidos_tempera")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      fornecedor_id: dados.fornecedor_id,
      observacoes: dados.observacoes,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const { error: itensError } = await supabase.from("pedidos_tempera_itens").insert(
    itens.map((item) => ({ ...item, pedido_id: pedido.id, empresa_id: context.empresa.id }))
  );

  if (itensError) return { error: itensError.message };

  revalidatePath("/pedidos-tempera");
  redirect(`/pedidos-tempera/${pedido.id}`);
}

const STATUS_VALIDOS = ["rascunho", "enviado", "em_producao", "recebido_parcial", "recebido", "cancelado"] as const;

export async function atualizarStatusPedidoAction(pedidoId: string, status: (typeof STATUS_VALIDOS)[number]) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "pedido_tempera.gerar")) {
    throw new Error("Você não tem permissão para gerenciar pedidos de têmpera.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("pedidos_tempera")
    .update({ status })
    .eq("id", pedidoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/pedidos-tempera/${pedidoId}`);
  revalidatePath("/pedidos-tempera");
}

export async function marcarItemRecebidoAction(itemId: string, pedidoId: string, recebido: boolean, observacao?: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "pedido_tempera.gerar")) {
    throw new Error("Você não tem permissão para conferir recebimento.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("pedidos_tempera_itens")
    .update({
      recebido,
      recebido_em: recebido ? new Date().toISOString() : null,
      observacao_recebimento: observacao ?? null,
    })
    .eq("id", itemId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);

  const { data: itens } = await supabase
    .from("pedidos_tempera_itens")
    .select("recebido")
    .eq("pedido_id", pedidoId);

  if (itens && itens.length > 0) {
    const todosRecebidos = itens.every((i) => i.recebido);
    const algumRecebido = itens.some((i) => i.recebido);
    const novoStatus = todosRecebidos ? "recebido" : algumRecebido ? "recebido_parcial" : "enviado";
    await supabase
      .from("pedidos_tempera")
      .update({ status: novoStatus })
      .eq("id", pedidoId)
      .eq("empresa_id", context.empresa.id);
  }

  revalidatePath(`/pedidos-tempera/${pedidoId}`);
}

export async function excluirPedidoTemperaAction(pedidoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "pedido_tempera.gerar")) {
    throw new Error("Você não tem permissão para gerenciar pedidos de têmpera.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("pedidos_tempera")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", pedidoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/pedidos-tempera");
}
