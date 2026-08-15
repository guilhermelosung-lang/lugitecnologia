"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { ETAPAS_PRODUCAO } from "@/lib/constants";

const schema = z.object({
  status: z.enum(ETAPAS_PRODUCAO.map((e) => e.value) as [string, ...string[]]),
});

export async function moverEtapaProducaoAction(obraId: string, novoStatus: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "obras.gerenciar")) {
    throw new Error("Você não tem permissão para mover obras na produção.");
  }

  const parsed = schema.safeParse({ status: novoStatus });
  if (!parsed.success) throw new Error("Etapa inválida.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("obras")
    .update({ status: parsed.data.status })
    .eq("id", obraId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/producao");
  revalidatePath("/obras");
}
