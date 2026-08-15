"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { SISTEMA_TIPOS } from "@/lib/constants";
import type { ActionState } from "@/lib/actions/auth";

const sistemaSchema = z.object({
  tipo: z.enum(SISTEMA_TIPOS.map((t) => t.value) as [string, ...string[]]),
  nome: z.string().trim().min(2, "Informe o nome do sistema."),
  fabricante: z.string().trim().optional().transform((v) => v || null),
  linha: z.string().trim().optional().transform((v) => v || null),
  modelo: z.string().trim().optional().transform((v) => v || null),
  descricao: z.string().trim().optional().transform((v) => v || null),
  espessuras_aceitas: z.string().trim().optional().transform((v) => v || null),
  medida_minima_mm: z.coerce.number().int().min(0).optional().nullable(),
  medida_maxima_mm: z.coerce.number().int().min(0).optional().nullable(),
  peso_maximo_kg: z.coerce.number().min(0).optional().nullable(),
  versao: z.string().trim().min(1).default("1"),
});

function parseSistemaForm(formData: FormData) {
  const raw = Object.fromEntries(formData);
  return sistemaSchema.safeParse({
    ...raw,
    medida_minima_mm: raw.medida_minima_mm || undefined,
    medida_maxima_mm: raw.medida_maxima_mm || undefined,
    peso_maximo_kg: raw.peso_maximo_kg || undefined,
  });
}

export async function criarSistemaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar o catálogo." };
  }

  const parsed = parseSistemaForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sistemas")
    .insert({ ...parsed.data, empresa_id: context.empresa.id, created_by: context.usuario.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/catalogo");
  redirect(`/catalogo/${data.id}`);
}

export async function atualizarSistemaAction(
  sistemaId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar o catálogo." };
  }

  const parsed = parseSistemaForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("sistemas")
    .update(parsed.data)
    .eq("id", sistemaId)
    .eq("empresa_id", context.empresa.id);

  if (error) return { error: error.message };

  revalidatePath("/catalogo");
  revalidatePath(`/catalogo/${sistemaId}`);
  redirect(`/catalogo/${sistemaId}`);
}

export async function excluirSistemaAction(sistemaId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar o catálogo.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("sistemas")
    .update({ ativo: false, deleted_at: new Date().toISOString() })
    .eq("id", sistemaId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/catalogo");
}

const kitSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do kit."),
  descricao: z.string().trim().optional().transform((v) => v || null),
});

export async function criarKitAction(sistemaId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar o catálogo.");
  }

  const parsed = kitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("kits")
    .insert({ ...parsed.data, sistema_id: sistemaId, empresa_id: context.empresa.id });

  if (error) throw new Error(error.message);
  revalidatePath(`/catalogo/${sistemaId}`);
}

export async function excluirKitAction(kitId: string, sistemaId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar o catálogo.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("kits")
    .update({ ativo: false, deleted_at: new Date().toISOString() })
    .eq("id", kitId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/catalogo/${sistemaId}`);
}

const pontoAberturaSchema = z.object({
  abertura_padrao_lado: z.enum(["esquerda", "direita", "central", "bilateral"]).optional().or(z.literal("")).transform((v) => v || null),
  abertura_padrao_tipo: z.enum(["corredica", "pivotante", "basculante", "giro", "fixo"]).optional().or(z.literal("")).transform((v) => v || null),
});

export async function atualizarPontoAberturaKitAction(kitId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar o catálogo.");
  }

  const parsed = pontoAberturaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("kits")
    .update(parsed.data)
    .eq("id", kitId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/catalogo/kits/${kitId}`);
}

const kitItemSchema = z.object({
  descricao: z.string().trim().min(2, "Informe a descrição do item."),
  tipo: z.enum(["perfil", "acessorio", "vidro", "outro"]),
  unidade: z.string().trim().min(1).default("un"),
  quantidade_padrao: z.coerce.number().min(0).default(1),
});

export async function criarKitItemAction(kitId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar o catálogo.");
  }

  const parsed = kitItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("kit_itens")
    .insert({ ...parsed.data, kit_id: kitId, empresa_id: context.empresa.id });

  if (error) throw new Error(error.message);
  revalidatePath(`/catalogo/kits/${kitId}`);
}

export async function excluirKitItemAction(itemId: string, kitId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "catalogo.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar o catálogo.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("kit_itens")
    .delete()
    .eq("id", itemId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/catalogo/kits/${kitId}`);
}
