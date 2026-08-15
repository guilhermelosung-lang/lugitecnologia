"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";

const parametroSchema = z.object({
  chave: z.string().min(1),
  descricao: z.string().optional(),
  valor: z.coerce.number(),
});

export async function salvarParametroKitAction(kitId: string, formData: FormData) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.parametros.editar")) {
    throw new Error("Você não tem permissão para editar parâmetros de cálculo.");
  }

  const parsed = parametroSchema.safeParse({
    chave: formData.get("chave"),
    descricao: formData.get("descricao"),
    valor: formData.get("valor"),
  });
  if (!parsed.success) throw new Error("Valor inválido.");

  const supabase = await createClient();
  const { error } = await supabase.from("parametros_calculo").upsert(
    {
      empresa_id: context.empresa.id,
      kit_id: kitId,
      chave: parsed.data.chave,
      valor: parsed.data.valor,
      descricao: parsed.data.descricao,
      unidade: parsed.data.chave === "coeficiente_peso" ? "" : "mm",
    },
    { onConflict: "kit_id,chave" }
  );

  if (error) throw new Error(error.message);
  revalidatePath(`/catalogo/kits/${kitId}`);
}
