"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const precoVidroSchema = z.object({
  fornecedor_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  tipo_vidro: z.enum(["incolor", "verde", "fume", "bronze", "refletivo", "laminado", "serigrafado", "espelho", "outro"]),
  cor: z.string().trim().min(1, "Informe a cor.").default("incolor"),
  espessura_mm: z.coerce.number().positive("Informe a espessura."),
  preco_vidro_m2: z.coerce.number().min(0, "Informe o preço do vidro por m²."),
  preco_tempera_m2: z.coerce.number().min(0).default(0),
  margem_padrao_percentual: z.coerce.number().min(0).default(0),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

function traduzErroDuplicidade() {
  return "Já existe um preço cadastrado para esse tipo de vidro, cor, espessura e fornecedor.";
}

export async function criarPrecoVidroAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar preços de vidro." };
  }

  const parsed = precoVidroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tabela_precos_vidro").insert({
    ...parsed.data,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) {
    if (error.code === "23505") return { error: traduzErroDuplicidade() };
    return { error: error.message };
  }

  revalidatePath("/fornecedores/precos-vidro");
  redirect("/fornecedores/precos-vidro");
}

export async function atualizarPrecoVidroAction(
  precoId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar preços de vidro." };
  }

  const parsed = precoVidroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tabela_precos_vidro")
    .update(parsed.data)
    .eq("id", precoId)
    .eq("empresa_id", context.empresa.id);

  if (error) {
    if (error.code === "23505") return { error: traduzErroDuplicidade() };
    return { error: error.message };
  }

  revalidatePath("/fornecedores/precos-vidro");
  redirect("/fornecedores/precos-vidro");
}

export async function excluirPrecoVidroAction(precoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar preços de vidro.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tabela_precos_vidro")
    .update({ ativo: false, deleted_at: new Date().toISOString() })
    .eq("id", precoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/fornecedores/precos-vidro");
}

export async function restaurarPrecoVidroAction(precoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "fornecedores.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar preços de vidro.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tabela_precos_vidro")
    .update({ ativo: true, deleted_at: null })
    .eq("id", precoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/fornecedores/precos-vidro");
}
