import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { AgendamentoItem } from "@/components/agenda/agendamento-item";
import { NovoAgendamentoForm } from "@/components/agenda/novo-agendamento-form";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tipo?: string }>;
}) {
  const context = await requireUsuario();
  const { status, tipo } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("agendamentos")
    .select("*, obras(nome), usuarios!agendamentos_responsavel_id_fkey(nome)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("data_hora_inicio");

  if (status) query = query.eq("status", status);
  else query = query.neq("status", "cancelado");
  if (tipo) query = query.eq("tipo", tipo);

  const [{ data: agendamentos }, { data: obras }, { data: usuarios }] = await Promise.all([
    query,
    supabase.from("obras").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
    supabase.from("usuarios").select("id, nome").eq("empresa_id", context.empresa.id).eq("ativo", true).order("nome"),
  ]);

  const porDia = new Map<string, typeof agendamentos>();
  for (const a of agendamentos ?? []) {
    const dia = new Date(a.data_hora_inicio).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
    porDia.set(dia, [...(porDia.get(dia) ?? []), a]);
  }

  const podeGerenciar = hasPermissao(context, "obras.gerenciar");
  const podeConcluir = hasPermissao(context, "instalacao.concluir");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Agenda e Instalações</h1>
        <p className="text-sm text-muted">{agendamentos?.length ?? 0} agendamento(s)</p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="status" defaultValue={status ?? ""} className="max-w-xs">
          <option value="">Ativos (agendado/concluído/reagendado)</option>
          <option value="agendado">Agendado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
          <option value="reagendado">Reagendado</option>
        </Select>
        <Select name="tipo" defaultValue={tipo ?? ""} className="max-w-xs">
          <option value="">Todos os tipos</option>
          <option value="medicao">Medição</option>
          <option value="instalacao">Instalação</option>
          <option value="visita_tecnica">Visita técnica</option>
          <option value="manutencao">Manutenção</option>
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      <div className="space-y-6">
        {Array.from(porDia.entries()).map(([dia, itens]) => (
          <div key={dia}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{dia}</h2>
            <div className="space-y-2">
              {(itens ?? []).map((a) => (
                <AgendamentoItem key={a.id} agendamento={a} podeGerenciar={podeGerenciar} podeConcluir={podeConcluir} />
              ))}
            </div>
          </div>
        ))}
        {(!agendamentos || agendamentos.length === 0) && (
          <p className="text-sm text-muted">Nenhum agendamento encontrado.</p>
        )}
      </div>

      {podeGerenciar && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Novo agendamento</h2>
          <NovoAgendamentoForm obras={obras ?? []} usuarios={usuarios ?? []} />
        </div>
      )}
    </div>
  );
}
