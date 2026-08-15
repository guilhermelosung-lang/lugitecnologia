"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const empresaSchema = z.object({
  razao_social: z.string().trim().min(2, "Informe a razão social."),
  nome_fantasia: z.string().trim().optional().transform((v) => v || null),
  telefone: z.string().trim().optional().transform((v) => v || null),
  whatsapp: z.string().trim().optional().transform((v) => v || null),
  email: z.string().trim().optional().transform((v) => v || null),
  endereco: z.string().trim().optional().transform((v) => v || null),
  cidade: z.string().trim().optional().transform((v) => v || null),
  estado: z.string().trim().optional().transform((v) => v || null),
  responsavel: z.string().trim().optional().transform((v) => v || null),
  chave_pix: z.string().trim().optional().transform((v) => v || null),
  texto_garantia: z.string().trim().optional().transform((v) => v || null),
  condicoes_comerciais: z.string().trim().optional().transform((v) => v || null),
  validade_orcamento_dias: z.coerce.number().int().min(1).default(15),
  margem_minima: z.coerce.number().min(0).default(0),
  percentual_perda: z.coerce.number().min(0).default(0),
  percentual_imposto: z.coerce.number().min(0).default(0),
  comissao_padrao: z.coerce.number().min(0).default(0),
  prazo_padrao_dias: z.coerce.number().int().min(1).default(15),
  garantia_padrao_meses: z.coerce.number().int().min(0).default(12),
});

export async function atualizarEmpresaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "empresa.configurar")) {
    return { error: "Você não tem permissão para editar as configurações da empresa." };
  }

  const parsed = empresaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("empresas")
    .update(parsed.data)
    .eq("id", context.empresa.id);

  if (error) return { error: error.message };

  revalidatePath("/empresa");
  return { success: true };
}
