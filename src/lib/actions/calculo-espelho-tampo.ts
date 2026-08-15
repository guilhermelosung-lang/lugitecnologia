"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { calcularEspelhoTampo } from "@/lib/calc/espelho-tampo";
import type { ActionState } from "@/lib/actions/auth";

const schema = z.object({
  nome: z.string().trim().optional().transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  tipo: z.enum(["espelho", "tampo", "prateleira"]),
  largura_mm: z.coerce.number().positive("Informe a largura."),
  altura_mm: z.coerce.number().positive("Informe a altura."),
  espessura_mm: z.coerce.number().positive("Informe a espessura."),
  coeficiente_peso: z.coerce.number().positive().default(2.5),
  acabamento_borda: z.enum(["lapidada", "polida", "boleada", "sem_acabamento"]),
  quantidade_furos_fixacao: z.coerce.number().int().min(0).default(0),
});

export async function calcularESalvarEspelhoTampoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar cálculos técnicos." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const resultado = calcularEspelhoTampo({
    tipo: dados.tipo,
    larguraMm: dados.largura_mm,
    alturaMm: dados.altura_mm,
    espessuraMm: dados.espessura_mm,
    coeficientePeso: dados.coeficiente_peso,
    acabamentoBorda: dados.acabamento_borda,
    quantidadeFurosFixacao: dados.quantidade_furos_fixacao,
  });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calculos_espelho_tampo")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      nome: dados.nome,
      tipo: dados.tipo,
      largura_mm: dados.largura_mm,
      altura_mm: dados.altura_mm,
      espessura_mm: dados.espessura_mm,
      coeficiente_peso: dados.coeficiente_peso,
      acabamento_borda: dados.acabamento_borda,
      quantidade_furos_fixacao: dados.quantidade_furos_fixacao,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/espelhos-tampos");
  redirect(`/espelhos-tampos/${data.id}`);
}
