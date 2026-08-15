import { redirect } from "next/navigation";
import { getCurrentAuthUser, getCurrentUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { CriarEmpresaForm } from "@/components/onboarding/criar-empresa-form";

export default async function OnboardingPage() {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login");

  const usuario = await getCurrentUsuario();
  if (usuario) redirect("/dashboard");

  const metadata = authUser.user_metadata as {
    nome?: string;
    razaoSocial?: string;
    cnpj?: string;
  };

  if (metadata.razaoSocial && metadata.cnpj && metadata.nome) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("bootstrap_empresa", {
      p_razao_social: metadata.razaoSocial,
      p_cpf_cnpj: metadata.cnpj,
      p_nome_usuario: metadata.nome,
    });
    if (!error) redirect("/dashboard");

    // Uma requisição concorrente (ex: prefetch) pode ter concluído o
    // bootstrap primeiro; nesse caso o usuário já existe de verdade.
    if (error.message.includes("já pertence a uma empresa")) {
      redirect("/dashboard");
    }

    return (
      <div className="flex min-h-screen items-start justify-center bg-background px-4 py-12">
        <CriarEmpresaForm
          nomeInicial={metadata.nome}
          razaoSocialInicial={metadata.razaoSocial}
          avisoInicial={`Não foi possível concluir automaticamente: ${error.message}. Revise os dados abaixo.`}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 py-12">
      <CriarEmpresaForm />
    </div>
  );
}
