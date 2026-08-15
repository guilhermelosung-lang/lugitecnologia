"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const agendamentoSchema = z.object({
  obra_id: z.string().uuid("Selecione a obra."),
  tipo: z.enum(["medicao", "instalacao", "visita_tecnica", "manutencao"]),
  titulo: z.string().trim().min(2, "Informe um título."),
  data_hora_inicio: z.string().trim().min(1, "Informe a data e hora."),
  data_hora_fim: z.string().trim().optional().transform((v) => v || null),
  responsavel_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

export async function criarAgendamentoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    return { error: "Você não tem permissão para agendar." };
  }

  const parsed = agendamentoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("agendamentos").insert({
    ...parsed.data,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/agenda");
  return { success: true };
}

export async function concluirAgendamentoAction(agendamentoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "instalacao.concluir")) {
    throw new Error("Você não tem permissão para concluir agendamentos.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("agendamentos")
    .update({ status: "concluido" })
    .eq("id", agendamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/agenda");
}

export async function cancelarAgendamentoAction(agendamentoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar agendamentos.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("agendamentos")
    .update({ status: "cancelado" })
    .eq("id", agendamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/agenda");
}

export async function excluirAgendamentoAction(agendamentoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar agendamentos.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("agendamentos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", agendamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/agenda");
}
