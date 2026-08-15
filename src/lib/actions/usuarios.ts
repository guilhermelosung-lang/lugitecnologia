"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const conviteSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  nome: z.string().trim().optional().transform((v) => v || null),
  perfil_id: z.string().uuid("Selecione um perfil."),
});

export async function criarConviteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "usuarios.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar usuários." };
  }

  const parsed = conviteSchema.safeParse({
    email: formData.get("email"),
    nome: formData.get("nome"),
    perfil_id: formData.get("perfil_id"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("convites").insert({
    empresa_id: context.empresa.id,
    perfil_id: parsed.data.perfil_id,
    email: parsed.data.email,
    nome: parsed.data.nome,
    criado_por: context.usuario.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/usuarios");
  return { success: true };
}

export async function cancelarConviteAction(conviteId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "usuarios.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar usuários.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("convites")
    .delete()
    .eq("id", conviteId)
    .eq("empresa_id", context.empresa.id)
    .is("usado_em", null);

  if (error) throw new Error(error.message);
  revalidatePath("/usuarios");
}

export async function atualizarUsuarioAction(usuarioId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "usuarios.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar usuários.");
  }

  const perfilId = formData.get("perfil_id");
  const ativo = formData.get("ativo") === "true";

  const supabase = await createClient();
  const { error } = await supabase
    .from("usuarios")
    .update({ perfil_id: perfilId as string, ativo })
    .eq("id", usuarioId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/usuarios");
}
