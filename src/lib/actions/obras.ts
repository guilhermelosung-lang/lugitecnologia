"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { OBRA_STATUS, AMBIENTE_TIPOS } from "@/lib/constants";
import type { ActionState } from "@/lib/actions/auth";

const obraSchema = z.object({
  cliente_id: z.string().uuid("Selecione um cliente."),
  nome: z.string().trim().min(2, "Informe o nome da obra."),
  endereco: z.string().trim().optional().transform((v) => v || null),
  condominio: z.string().trim().optional().transform((v) => v || null),
  bloco: z.string().trim().optional().transform((v) => v || null),
  apartamento: z.string().trim().optional().transform((v) => v || null),
  andar: z.string().trim().optional().transform((v) => v || null),
  responsavel_local: z.string().trim().optional().transform((v) => v || null),
  telefone_local: z.string().trim().optional().transform((v) => v || null),
  data_visita: z.string().trim().optional().transform((v) => v || null),
  data_prevista: z.string().trim().optional().transform((v) => v || null),
  situacao_acesso: z.string().trim().optional().transform((v) => v || null),
  necessita_andaime: z.coerce.boolean().optional().default(false),
  necessita_icamento: z.coerce.boolean().optional().default(false),
  restricoes_horario: z.string().trim().optional().transform((v) => v || null),
  estacionamento: z.string().trim().optional().transform((v) => v || null),
  observacoes: z.string().trim().optional().transform((v) => v || null),
  status: z.enum(OBRA_STATUS.map((s) => s.value) as [string, ...string[]]).default("lead"),
});

function parseObraForm(formData: FormData) {
  const raw = Object.fromEntries(formData);
  return obraSchema.safeParse({
    ...raw,
    necessita_andaime: formData.get("necessita_andaime") === "on",
    necessita_icamento: formData.get("necessita_icamento") === "on",
  });
}

export async function criarObraAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar obras." };
  }

  const parsed = parseObraForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("obras")
    .insert({ ...parsed.data, empresa_id: context.empresa.id, created_by: context.usuario.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/obras");
  redirect(`/obras/${data.id}`);
}

export async function atualizarObraAction(
  obraId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar obras." };
  }

  const parsed = parseObraForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("obras")
    .update(parsed.data)
    .eq("id", obraId)
    .eq("empresa_id", context.empresa.id);

  if (error) return { error: error.message };

  revalidatePath("/obras");
  revalidatePath(`/obras/${obraId}`);
  redirect(`/obras/${obraId}`);
}

export async function excluirObraAction(obraId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar obras.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("obras")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", obraId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/obras");
  revalidatePath(`/obras/${obraId}`);
}

export async function restaurarObraAction(obraId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar obras.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("obras")
    .update({ deleted_at: null })
    .eq("id", obraId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/obras");
  revalidatePath(`/obras/${obraId}`);
}

const ambienteSchema = z.object({
  tipo: z.enum(AMBIENTE_TIPOS.map((t) => t.value) as [string, ...string[]]),
  nome_personalizado: z.string().trim().optional().transform((v) => v || null),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

export async function criarAmbienteAction(obraId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar obras.");
  }

  const parsed = ambienteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("ambientes")
    .insert({ ...parsed.data, obra_id: obraId, empresa_id: context.empresa.id });

  if (error) throw new Error(error.message);
  revalidatePath(`/obras/${obraId}`);
}

export async function excluirAmbienteAction(ambienteId: string, obraId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar obras.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("ambientes")
    .delete()
    .eq("id", ambienteId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/obras/${obraId}`);
}
