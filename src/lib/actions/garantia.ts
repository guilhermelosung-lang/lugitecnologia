"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const chamadoSchema = z.object({
  obra_id: z.string().uuid("Selecione a obra."),
  titulo: z.string().trim().min(2, "Informe um título."),
  descricao: z.string().trim().min(2, "Descreva o problema."),
  tipo: z.enum(["garantia", "assistencia", "reclamacao"]),
  prioridade: z.enum(["baixa", "media", "alta"]),
});

export async function criarChamadoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    return { error: "Você não tem permissão para abrir chamados." };
  }

  const parsed = chamadoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("chamados_garantia").insert({
    ...parsed.data,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/garantia");
  return { success: true };
}

export async function atualizarStatusChamadoAction(
  chamadoId: string,
  novoStatus: "aberto" | "em_atendimento" | "resolvido" | "cancelado",
  resolucao?: string
) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar chamados.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("chamados_garantia")
    .update({
      status: novoStatus,
      resolucao: resolucao ?? null,
      data_resolucao: novoStatus === "resolvido" ? new Date().toISOString() : null,
    })
    .eq("id", chamadoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/garantia");
}

export async function excluirChamadoAction(chamadoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar chamados.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("chamados_garantia")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", chamadoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/garantia");
}
