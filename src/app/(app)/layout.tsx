import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireUsuario();

  const emTrial = context.empresa.plano_status === "trial";
  const diasRestantesTrial = emTrial && context.empresa.plano_expira_em
    ? Math.ceil((new Date(context.empresa.plano_expira_em).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const trialExpirado = diasRestantesTrial !== null && diasRestantesTrial < 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar empresaNome={context.empresa.nome_fantasia || context.empresa.razao_social} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar nome={context.usuario.nome} perfilNome={context.perfil.nome} />
        {emTrial && (
          <Link
            href="/planos"
            className={`px-4 py-2 text-center text-xs font-medium md:px-8 ${
              trialExpirado ? "bg-danger text-white" : "bg-accent text-white"
            }`}
          >
            {trialExpirado
              ? "⏰ Seu teste grátis de 7 dias acabou — escolha um plano para continuar"
              : `🎁 Teste grátis: restam ${diasRestantesTrial} dia(s) — clique para ver os planos`}
          </Link>
        )}
        <main className="flex-1 px-4 py-6 pb-20 md:px-8 md:py-8 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
