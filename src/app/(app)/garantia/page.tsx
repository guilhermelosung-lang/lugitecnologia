import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ChamadoCard } from "@/components/garantia/chamado-card";
import { NovoChamadoForm } from "@/components/garantia/novo-chamado-form";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function GarantiaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tipo?: string }>;
}) {
  const context = await requireUsuario();
  const { status, tipo } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("chamados_garantia")
    .select("*, obras(nome)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("data_abertura", { ascending: false });

  if (status) query = query.eq("status", status);
  if (tipo) query = query.eq("tipo", tipo);

  const [{ data: chamados }, { data: obras }] = await Promise.all([
    query,
    supabase.from("obras").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
  ]);

  const podeGerenciar = hasPermissao(context, "obras.gerenciar");
  const abertos = (chamados ?? []).filter((c) => c.status === "aberto").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Garantia e Pós-venda</h1>
        <p className="text-sm text-muted">
          {chamados?.length ?? 0} chamado(s) · {abertos} aberto(s) aguardando atendimento
        </p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="status" defaultValue={status ?? ""} className="max-w-xs">
          <option value="">Todos os status</option>
          <option value="aberto">Aberto</option>
          <option value="em_atendimento">Em atendimento</option>
          <option value="resolvido">Resolvido</option>
          <option value="cancelado">Cancelado</option>
        </Select>
        <Select name="tipo" defaultValue={tipo ?? ""} className="max-w-xs">
          <option value="">Todos os tipos</option>
          <option value="garantia">Garantia</option>
          <option value="assistencia">Assistência</option>
          <option value="reclamacao">Reclamação</option>
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {(chamados ?? []).map((c) => (
          <ChamadoCard key={c.id} chamado={c} />
        ))}
        {(!chamados || chamados.length === 0) && (
          <p className="text-sm text-muted md:col-span-2">Nenhum chamado encontrado.</p>
        )}
      </div>

      {podeGerenciar && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Abrir novo chamado</h2>
          <NovoChamadoForm obras={obras ?? []} />
        </div>
      )}
    </div>
  );
}
