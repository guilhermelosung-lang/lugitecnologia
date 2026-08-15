"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; success?: boolean } | undefined;

const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export async function signInAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  redirect("/onboarding");
}

const signupSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  razaoSocial: z.string().trim().min(2, "Informe a razão social da empresa."),
  cnpj: z.string().trim().min(11, "Informe um CPF ou CNPJ válido."),
});

export async function signUpAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    password: formData.get("password"),
    razaoSocial: formData.get("razaoSocial"),
    cnpj: formData.get("cnpj"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { nome, email, password, razaoSocial, cnpj } = parsed.data;

  // razaoSocial/cnpj ficam nos metadados do auth user; a criação da empresa
  // (bootstrap_empresa) acontece em /onboarding, pois só ali sabemos se o
  // projeto exige confirmação de e-mail (sem sessão imediata) ou não.
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome, razaoSocial, cnpj: cnpj.replace(/\D/g, "") } },
  });
  if (signUpError) {
    return { error: traduzErroAuth(signUpError.message) };
  }

  if (!data.session) {
    redirect("/signup/verifique-seu-email");
  }

  redirect("/onboarding");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function traduzErroAuth(message: string) {
  if (message.toLowerCase().includes("already registered")) {
    return "Este e-mail já está cadastrado.";
  }
  return message;
}
