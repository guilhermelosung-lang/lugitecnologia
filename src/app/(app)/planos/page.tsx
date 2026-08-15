import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { PlanoCard } from "@/components/planos/plano-card";
import { StatusPlanoForm } from "@/components/planos/status-plano-form";

const STATUS_LABEL: Record<string, string> = {
  sem_plano: "Sem plano selecionado",
  trial: "Teste grátis",
  ativo: "Ativo",
  inadimplente: "Inadimplente",
  cancelado: "Cancelado",
};

export default async function PlanosPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: planos }, { data: empresa }, { count: usuariosAtivos }, { count: obrasNoMes }] = await Promise.all([
    supabase.from("planos").select("*").eq("ativo", true).order("ordem"),
    supabase.from("empresas").select("plano_id, plano_status, plano_expira_em").eq("id", context.empresa.id).single(),
    supabase.from("usuarios").select("id", { count: "exact", head: true }).eq("empresa_id", context.empresa.id).eq("ativo", true),
    supabase
      .from("obras")
      .select("id", { count: "exact", head: true })
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .gte("created_at", startOfMonth.toISOString()),
  ]);

  const podeGerenciar = hasPermissao(context, "empresa.configurar");
  const planoAtual = (planos ?? []).find((p) => p.id === empresa?.plano_id) ?? null;

  const emTrial = empresa?.plano_status === "trial";
  const diasRestantesTrial = emTrial && empresa?.plano_expira_em
    ? Math.ceil((new Date(empresa.plano_expira_em).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const trialExpirado = diasRestantesTrial !== null && diasRestantesTrial < 0;

  const usuariosAcimaDoLimite =
    planoAtual?.limite_usuarios != null && (usuariosAtivos ?? 0) > planoAtual.limite_usuarios;
  const obrasAcimaDoLimite =
    planoAtual?.limite_obras_mes != null && (obrasNoMes ?? 0) > planoAtual.limite_obras_mes;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Planos e Assinatura</h1>
        <p className="text-sm text-muted">
          Controle manual de plano — ainda não há cobrança automática integrada. Marque o status
          conforme o pagamento for confirmado fora do sistema.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Plano atual</p>
            <p className="font-heading text-lg font-semibold text-primary">
              {planoAtual?.nome ?? "Nenhum plano selecionado"}
            </p>
            <p className="text-sm text-muted">
              Status: <strong className="text-foreground">{STATUS_LABEL[empresa?.plano_status ?? "sem_plano"]}</strong>
              {empresa?.plano_expira_em ? ` · válido até ${empresa.plano_expira_em}` : ""}
            </p>
          </div>
          {podeGerenciar && (
            <StatusPlanoForm status={empresa?.plano_status ?? "sem_plano"} expiraEm={empresa?.plano_expira_em ?? ""} />
          )}
        </div>

        {emTrial && (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm ${
              trialExpirado
                ? "border-danger/30 bg-danger/10 text-danger"
                : "border-accent/30 bg-accent/10 text-accent-dark"
            }`}
          >
            {trialExpirado
              ? "⏰ Seu período de teste grátis acabou. Escolha um plano abaixo para continuar usando o sistema."
              : `🎁 Você está no teste grátis de 7 dias — restam ${diasRestantesTrial} dia(s). Escolha um plano abaixo quando quiser continuar.`}
          </div>
        )}

        {(usuariosAcimaDoLimite || obrasAcimaDoLimite) && (
          <div className="mt-4 space-y-1 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-foreground">
            {usuariosAcimaDoLimite && (
              <p>⚠️ Você tem {usuariosAtivos} usuário(s) ativo(s), acima do limite de {planoAtual!.limite_usuarios} do plano {planoAtual!.nome}.</p>
            )}
            {obrasAcimaDoLimite && (
              <p>⚠️ Você criou {obrasNoMes} obra(s) este mês, acima do limite de {planoAtual!.limite_obras_mes} do plano {planoAtual!.nome}.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(planos ?? []).map((plano) => (
          <PlanoCard key={plano.id} plano={plano} selecionado={plano.id === empresa?.plano_id} podeSelecionar={podeGerenciar} />
        ))}
      </div>
    </div>
  );
}
