"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

const clienteSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do cliente."),
  cpf_cnpj: z.string().trim().optional().transform((v) => v?.replace(/\D/g, "") || null),
  telefone: z.string().trim().optional().transform((v) => v || null),
  whatsapp: z.string().trim().optional().transform((v) => v || null),
  email: z.string().trim().optional().transform((v) => v || null),
  endereco: z.string().trim().optional().transform((v) => v || null),
  cep: z.string().trim().optional().transform((v) => v || null),
  cidade: z.string().trim().optional().transform((v) => v || null),
  estado: z.string().trim().optional().transform((v) => v || null),
  bairro: z.string().trim().optional().transform((v) => v || null),
  responsavel: z.string().trim().optional().transform((v) => v || null),
  origem: z.string().trim().optional().transform((v) => v || null),
  observacoes: z.string().trim().optional().transform((v) => v || null),
});

function parseClienteForm(formData: FormData) {
  return clienteSchema.safeParse({
    nome: formData.get("nome"),
    cpf_cnpj: formData.get("cpf_cnpj"),
    telefone: formData.get("telefone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    endereco: formData.get("endereco"),
    cep: formData.get("cep"),
    cidade: formData.get("cidade"),
    estado: formData.get("estado"),
    bairro: formData.get("bairro"),
    responsavel: formData.get("responsavel"),
    origem: formData.get("origem"),
    observacoes: formData.get("observacoes"),
  });
}

function traduzErroDuplicidade(message: string) {
  if (message.includes("clientes_cpf_cnpj_unique")) {
    return "Já existe um cliente com este CPF/CNPJ.";
  }
  if (message.includes("clientes_telefone_unique")) {
    return "Já existe um cliente com este telefone.";
  }
  if (message.includes("clientes_email_unique")) {
    return "Já existe um cliente com este e-mail.";
  }
  return "Não foi possível salvar: dado duplicado.";
}

export async function criarClienteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "clientes.criar")) {
    return { error: "Você não tem permissão para cadastrar clientes." };
  }

  const parsed = parseClienteForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .insert({
      ...parsed.data,
      empresa_id: context.empresa.id,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: traduzErroDuplicidade(error.message) };
    return { error: error.message };
  }

  revalidatePath("/clientes");
  redirect(`/clientes/${data.id}`);
}

export async function atualizarClienteAction(
  clienteId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "clientes.editar")) {
    return { error: "Você não tem permissão para editar clientes." };
  }

  const parsed = parseClienteForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update(parsed.data)
    .eq("id", clienteId)
    .eq("empresa_id", context.empresa.id);

  if (error) {
    if (error.code === "23505") return { error: traduzErroDuplicidade(error.message) };
    return { error: error.message };
  }

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clienteId}`);
  redirect(`/clientes/${clienteId}`);
}

export async function excluirClienteAction(clienteId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "clientes.excluir")) {
    throw new Error("Você não tem permissão para excluir clientes.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update({ status: "inativo", deleted_at: new Date().toISOString() })
    .eq("id", clienteId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clienteId}`);
}

export async function restaurarClienteAction(clienteId: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, "clientes.editar")) {
    throw new Error("Você não tem permissão para restaurar clientes.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update({ status: "ativo", deleted_at: null })
    .eq("id", clienteId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clienteId}`);
}
