"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const schema = z.object({
  obra_id: z.string().uuid("Selecione a obra."),
  categoria: z.enum(["esquadria_aluminio", "serralheria"]),
  descricao: z.string().trim().min(2, "Descreva o item."),
  especificacao: z.string().trim().optional().transform((v) => v || null),
  material: z.string().trim().optional().transform((v) => v || null),
  cor: z.string().trim().optional().transform((v) => v || null),
  quantidade: z.coerce.number().int().min(1).default(1),
  valor_estimado: z.coerce.number().min(0).optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

export async function criarProjetoEsquadriaSerralheriaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    return { error: "Você não tem permissão para gerenciar projetos de esquadria/serralheria." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("projetos_esquadria_serralheria").insert({
    ...parsed.data,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/esquadrias-serralheria");
  return { success: true };
}

const STATUS_VALIDOS = ["orcamento", "aprovado", "em_producao", "instalado", "cancelado"] as const;

export async function atualizarStatusProjetoAction(id: string, status: (typeof STATUS_VALIDOS)[number]) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar projetos de esquadria/serralheria.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projetos_esquadria_serralheria")
    .update({ status })
    .eq("id", id)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/esquadrias-serralheria");
}

export async function excluirProjetoEsquadriaSerralheriaAction(id: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar projetos de esquadria/serralheria.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projetos_esquadria_serralheria")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/esquadrias-serralheria");
}
