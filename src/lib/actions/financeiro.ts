"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const lancamentoSchema = z.object({
  tipo: z.enum(["receber", "pagar"]),
  descricao: z.string().trim().min(2, "Informe a descrição."),
  valor: z.coerce.number().positive("Informe um valor maior que zero."),
  categoria: z.enum(["orcamento", "fornecedor", "despesa_fixa", "salario", "frete", "outro"]),
  data_vencimento: z.string().trim().min(1, "Informe o vencimento."),
  fornecedor_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

export async function criarLancamentoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "financeiro.acessar")) {
    return { error: "Você não tem permissão para acessar o financeiro." };
  }

  const parsed = lancamentoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("financeiro_lancamentos").insert({
    ...parsed.data,
    empresa_id: context.empresa.id,
    created_by: context.usuario.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/financeiro");
  return { success: true };
}

export async function marcarComoPagoAction(lancamentoId: string, dataPagamento: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "financeiro.acessar")) {
    throw new Error("Você não tem permissão para acessar o financeiro.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("financeiro_lancamentos")
    .update({ status: "pago", data_pagamento: dataPagamento })
    .eq("id", lancamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}

export async function reabrirLancamentoAction(lancamentoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "financeiro.acessar")) {
    throw new Error("Você não tem permissão para acessar o financeiro.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("financeiro_lancamentos")
    .update({ status: "pendente", data_pagamento: null })
    .eq("id", lancamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}

export async function excluirLancamentoAction(lancamentoId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "financeiro.acessar")) {
    throw new Error("Você não tem permissão para acessar o financeiro.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("financeiro_lancamentos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", lancamentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}
