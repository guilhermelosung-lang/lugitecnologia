import { createClient } from "@/lib/supabase/server";
import { getCurrentAuthUser } from "@/lib/auth/context";
import { Card, CardBody } from "@/components/ui/card";
import { SignupConviteForm } from "@/components/onboarding/signup-convite-form";
import { AceitarConviteButton } from "@/components/onboarding/aceitar-convite-button";

export default async function ConvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: convite } = await supabase
    .from("convites")
    .select("*, empresas(razao_social, nome_fantasia), perfis(nome)")
    .eq("token", token)
    .maybeSingle();

  if (!convite) {
    return (
      <Shell>
        <p className="text-sm text-danger">Este link de convite não existe ou foi removido.</p>
      </Shell>
    );
  }
  if (convite.usado_em) {
    return (
      <Shell>
        <p className="text-sm text-danger">Este convite já foi utilizado.</p>
      </Shell>
    );
  }
  if (new Date(convite.expira_em) < new Date()) {
    return (
      <Shell>
        <p className="text-sm text-danger">Este convite expirou. Peça um novo link ao administrador.</p>
      </Shell>
    );
  }

  const authUser = await getCurrentAuthUser();
  const empresaNome = convite.empresas?.nome_fantasia || convite.empresas?.razao_social || "";

  return (
    <Shell>
      <p className="mb-6 text-sm text-muted">
        Você foi convidado para <strong className="text-foreground">{empresaNome}</strong> como{" "}
        <span className="capitalize">{convite.perfis?.nome}</span>.
      </p>
      {authUser ? (
        <AceitarConviteButton token={token} />
      ) : (
        <SignupConviteForm token={token} emailConvidado={convite.email} nomeSugerido={convite.nome} />
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardBody>
          <h1 className="mb-1 font-heading text-xl font-semibold text-primary">Convite</h1>
          {children}
        </CardBody>
      </Card>
    </div>
  );
}
