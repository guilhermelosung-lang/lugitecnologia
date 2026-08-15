"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const fornecedorSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do fornecedor."),
  cnpj: z.string().trim().optional().transform((v) => v?.replace(/\D/g, "") || null),
  contato: z.string().trim().optional().transform((v) => v || null),
  telefone: z.string().trim().optional().transform((v) => v || null),
  whatsapp: z.string().trim().optional().transform((v) => v || null),
  email: z.string().trim().optional().transform((v) => v || null),
  endereco: z.string().trim().optional().transform((v) => v || null),
  cidade: z.string().trim().optional().transform((v) => v || null),
  estado: z.string().trim().optional().transform((v) => v || null),
  prazo_entrega_dias: z.coerce.number().int().min(0).optional().nullable(),
  regioes_atendidas: z.string().trim().optional().transform((v) => v || null),
  condicoes_pagamento: z.string().trim().optional().transform((v) => v || null),
  frete: z.string().trim().optional().transform((v) => v || null),
  pedido_minimo: z.coerce.number().min(0).optional().nullable(),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData);
  return fornecedorSchema.safeParse({
    ...raw,
    prazo_entrega_dias: raw.prazo_entrega_dias || undefined,
    pedido_minimo: raw.pedido_minimo || undefined,
  });
}

function traduzErroDuplicidade(message: string) {
  if (message.includes("fornecedores_cnpj_unique")) {
    return "Já existe um fornecedor com este CNPJ.";
  }
  return "Não foi possível salvar: dado duplicado.";
}

export async function criarFornecedorAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar fornecedores." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fornecedores")
    .insert({ ...parsed.data, empresa_id: context.empresa.id, created_by: context.usuario.id })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: traduzErroDuplicidade(error.message) };
    return { error: error.message };
  }

  revalidatePath("/fornecedores");
  redirect(`/fornecedores/${data.id}`);
}

export async function atualizarFornecedorAction(
  fornecedorId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar fornecedores." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("fornecedores")
    .update(parsed.data)
    .eq("id", fornecedorId)
    .eq("empresa_id", context.empresa.id);

  if (error) {
    if (error.code === "23505") return { error: traduzErroDuplicidade(error.message) };
    return { error: error.message };
  }

  revalidatePath("/fornecedores");
  revalidatePath(`/fornecedores/${fornecedorId}`);
  redirect(`/fornecedores/${fornecedorId}`);
}

export async function excluirFornecedorAction(fornecedorId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar fornecedores.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("fornecedores")
    .update({ status: "inativo", deleted_at: new Date().toISOString() })
    .eq("id", fornecedorId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/fornecedores");
  revalidatePath(`/fornecedores/${fornecedorId}`);
}

export async function restaurarFornecedorAction(fornecedorId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar fornecedores.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("fornecedores")
    .update({ status: "ativo", deleted_at: null })
    .eq("id", fornecedorId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/fornecedores");
  revalidatePath(`/fornecedores/${fornecedorId}`);
}
