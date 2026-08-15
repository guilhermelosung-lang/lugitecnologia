"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAuthUser, getCurrentUsuario } from "@/lib/auth/context";
import type { ActionState } from "@/lib/actions/auth";

/**
 * Chamado a partir de /onboarding. Se o auth user ainda não tem linha em
 * `usuarios`, cria a empresa usando os metadados salvos no signup
 * (razaoSocial/cnpj/nome) e o usuário vira administrador dela.
 */
export async function completarOnboardingAction(): Promise<ActionState> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login");

  const jaTemUsuario = await getCurrentUsuario();
  if (jaTemUsuario) redirect("/dashboard");

  const metadata = authUser.user_metadata as {
    nome?: string;
    razaoSocial?: string;
    cnpj?: string;
  };

  if (!metadata.razaoSocial || !metadata.cnpj || !metadata.nome) {
    return {
      error:
        "Não encontramos os dados da empresa para este cadastro. Preencha manualmente abaixo.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("bootstrap_empresa", {
    p_razao_social: metadata.razaoSocial,
    p_cpf_cnpj: metadata.cnpj,
    p_nome_usuario: metadata.nome,
  });
  if (error) {
    return { error: `Erro ao configurar a empresa: ${error.message}` };
  }

  redirect("/dashboard");
}

const criarEmpresaSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo."),
  razaoSocial: z.string().trim().min(2, "Informe a razão social da empresa."),
  cnpj: z.string().trim().min(11, "Informe um CPF ou CNPJ válido."),
});

export async function criarEmpresaManualAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = criarEmpresaSchema.safeParse({
    nome: formData.get("nome"),
    razaoSocial: formData.get("razaoSocial"),
    cnpj: formData.get("cnpj"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login");

  const supabase = await createClient();
  const { error } = await supabase.rpc("bootstrap_empresa", {
    p_razao_social: parsed.data.razaoSocial,
    p_cpf_cnpj: parsed.data.cnpj.replace(/\D/g, ""),
    p_nome_usuario: parsed.data.nome,
  });
  if (error) {
    return { error: `Erro ao configurar a empresa: ${error.message}` };
  }

  redirect("/dashboard");
}

export async function aceitarConviteAction(
  token: string
): Promise<ActionState> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect(`/login?next=/convite/${token}`);

  const supabase = await createClient();
  const { error } = await supabase.rpc("aceitar_convite", { p_token: token });
  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

const signupConviteSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

/** Cria a conta de autenticação de um convidado e, se a sessão já vier ativa
 * (sem exigência de confirmação de e-mail), aceita o convite na hora. */
export async function signUpParaConviteAction(
  token: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signupConviteSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { nome: parsed.data.nome } },
  });
  if (error) {
    return { error: error.message.toLowerCase().includes("already registered")
      ? "Este e-mail já está cadastrado. Faça login para aceitar o convite."
      : error.message };
  }

  if (!data.session) {
    redirect(`/login?next=/convite/${token}`);
  }

  const { error: aceitarError } = await supabase.rpc("aceitar_convite", {
    p_token: token,
  });
  if (aceitarError) {
    return { error: aceitarError.message };
  }

  redirect("/dashboard");
}
