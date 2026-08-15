"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

export async function selecionarPlanoAction(planoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "empresa.configurar")) {
    throw new Error("Você não tem permissão para alterar o plano da empresa.");
  }

  const dataExpiracao = new Date();
  dataExpiracao.setDate(dataExpiracao.getDate() + 30);

  const supabase = await createClient();
  const { error } = await supabase
    .from("empresas")
    .update({
      plano_id: planoId,
      plano_status: "ativo",
      plano_expira_em: dataExpiracao.toISOString().slice(0, 10),
    })
    .eq("id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/planos");
  revalidatePath("/dashboard");
}

const statusSchema = z.object({
  plano_status: z.enum(["sem_plano", "trial", "ativo", "inadimplente", "cancelado"]),
  plano_expira_em: z.string().trim().optional().transform((v) => v || null),
});

export async function atualizarStatusPlanoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "empresa.configurar")) {
    return { error: "Você não tem permissão para alterar o plano da empresa." };
  }

  const parsed = statusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("empresas")
    .update(parsed.data)
    .eq("id", context.empresa.id);

  if (error) return { error: error.message };

  revalidatePath("/planos");
  revalidatePath("/dashboard");
  return { success: true };
}
