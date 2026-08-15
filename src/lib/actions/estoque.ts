"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { ITEM_CATEGORIAS, MOVIMENTACAO_TIPOS } from "@/lib/constants";
import type { ActionState } from "@/lib/actions/auth";

const itemSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do item."),
  categoria: z.enum(ITEM_CATEGORIAS.map((c) => c.value) as [string, ...string[]]),
  unidade: z.string().trim().min(1).default("un"),
  quantidade_minima: z.coerce.number().min(0).default(0),
  custo_unitario: z.coerce.number().min(0).optional().nullable(),
  fornecedor_id: z.string().uuid().optional().nullable().or(z.literal("")).transform((v) => v || null),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

function parseItemForm(formData: FormData) {
  const raw = Object.fromEntries(formData);
  return itemSchema.safeParse({
    ...raw,
    custo_unitario: raw.custo_unitario || undefined,
  });
}

export async function criarItemEstoqueAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "estoque.movimentar")) {
    return { error: "Você não tem permissão para gerenciar o estoque." };
  }

  const parsed = parseItemForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itens_estoque")
    .insert({ ...parsed.data, empresa_id: context.empresa.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/estoque");
  redirect(`/estoque/${data.id}`);
}

export async function atualizarItemEstoqueAction(
  itemId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "estoque.movimentar")) {
    return { error: "Você não tem permissão para gerenciar o estoque." };
  }

  const parsed = parseItemForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("itens_estoque")
    .update(parsed.data)
    .eq("id", itemId)
    .eq("empresa_id", context.empresa.id);

  if (error) return { error: error.message };

  revalidatePath("/estoque");
  revalidatePath(`/estoque/${itemId}`);
  redirect(`/estoque/${itemId}`);
}

export async function excluirItemEstoqueAction(itemId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "estoque.movimentar")) {
    throw new Error("Você não tem permissão para gerenciar o estoque.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("itens_estoque")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", itemId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/estoque");
}

const movimentacaoSchema = z.object({
  tipo: z.enum(MOVIMENTACAO_TIPOS.map((t) => t.value) as [string, ...string[]]),
  quantidade: z.coerce.number(),
  motivo: z.string().trim().optional().transform((v) => v || null),
});

export async function registrarMovimentacaoAction(itemId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "estoque.movimentar")) {
    throw new Error("Você não tem permissão para movimentar o estoque.");
  }

  const parsed = movimentacaoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  if (parsed.data.tipo !== "ajuste" && parsed.data.quantidade <= 0) {
    throw new Error("A quantidade deve ser maior que zero.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("movimentacoes_estoque").insert({
    ...parsed.data,
    quantidade: Math.abs(parsed.data.quantidade) * (parsed.data.tipo === "ajuste" && formData.get("sinal") === "negativo" ? -1 : 1),
    item_id: itemId,
    empresa_id: context.empresa.id,
    usuario_id: context.usuario.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/estoque/${itemId}`);
  revalidatePath("/estoque");
}
