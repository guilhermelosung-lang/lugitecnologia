import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export const getCurrentAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export type UsuarioContext = {
  usuario: Tables<"usuarios">;
  empresa: Tables<"empresas">;
  perfil: Tables<"perfis">;
  permissoes: string[];
};

/**
 * Resolves the full app identity for the signed-in auth user: their linha em
 * `usuarios`, a empresa, o perfil e o conjunto de chaves de permissão.
 * Retorna null quando o auth user existe mas ainda não completou o
 * onboarding (nenhuma linha em `usuarios`) — a página chamadora decide se
 * redireciona para /onboarding.
 */
export const getCurrentUsuario = cache(
  async (): Promise<UsuarioContext | null> => {
    const authUser = await getCurrentAuthUser();
    if (!authUser) return null;

    const supabase = await createClient();
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (!usuario) return null;

    const [{ data: empresa }, { data: perfil }, { data: perfilPermissoes }] =
      await Promise.all([
        supabase
          .from("empresas")
          .select("*")
          .eq("id", usuario.empresa_id)
          .single(),
        supabase.from("perfis").select("*").eq("id", usuario.perfil_id).single(),
        supabase
          .from("perfil_permissoes")
          .select("permissoes(chave)")
          .eq("perfil_id", usuario.perfil_id),
      ]);

    if (!empresa || !perfil) return null;

    const permissoes = (perfilPermissoes ?? [])
      .map((row) => row.permissoes?.chave)
      .filter((chave): chave is string => Boolean(chave));

    return { usuario, empresa, perfil, permissoes };
  }
);

export async function requireUsuario() {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login");

  const context = await getCurrentUsuario();
  if (!context) redirect("/onboarding");

  return context;
}

export function hasPermissao(context: UsuarioContext, chave: string) {
  return context.permissoes.includes(chave);
}

export async function requirePermissao(chave: string) {
  const context = await requireUsuario();
  if (!hasPermissao(context, chave)) {
    redirect("/dashboard?erro=sem-permissao");
  }
  return context;
}
