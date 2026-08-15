"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const catalogoSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome."),
  tipo: z.enum(["furo", "recorte", "lapidacao", "chanfro", "polimento", "outro"]),
  descricao: z.string().trim().optional().transform((v) => v || null),
  preco_unitario: z.coerce.number().min(0).optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
});

export async function criarBeneficiamentoCatalogoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar o catálogo." };
  }

  const parsed = catalogoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("beneficiamentos_catalogo").insert({
    ...parsed.data,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/beneficiamentos");
  return { success: true };
}

export async function excluirBeneficiamentoCatalogoAction(id: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar o catálogo.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("beneficiamentos_catalogo")
    .update({ ativo: false, deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/beneficiamentos");
}

const lancamentoSchema = z.object({
  beneficiamento_id: z.string().uuid("Selecione o tipo de beneficiamento."),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  peca_referencia: z.string().trim().min(1, "Informe a peça/local."),
  quantidade: z.coerce.number().int().min(1).default(1),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

export async function registrarBeneficiamentoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para registrar beneficiamentos." };
  }

  const parsed = lancamentoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("beneficiamentos_lancamentos").insert({
    ...parsed.data,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/beneficiamentos");
  return { success: true };
}

export async function excluirBeneficiamentoLancamentoAction(id: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    throw new Error("Você não tem permissão para gerenciar beneficiamentos.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("beneficiamentos_lancamentos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/beneficiamentos");
}
