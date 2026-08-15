"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";

const medicaoSchema = z.object({
  tipo_medida: z.enum(["vao", "diagonal", "nivel", "prumo", "outro"]),
  largura_mm: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
  altura_mm: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
  diagonal1_mm: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
  diagonal2_mm: z.coerce.number().positive().optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

export async function criarMedicaoAction(ambienteId: string, obraId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para registrar medições.");
  }

  const parsed = medicaoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("medicoes").insert({
    ...parsed.data,
    ambiente_id: ambienteId,
    obra_id: obraId,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/obras/${obraId}`);
}

export async function excluirMedicaoAction(medicaoId: string, obraId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para gerenciar medições.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("medicoes")
    .delete()
    .eq("id", medicaoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/obras/${obraId}`);
}
