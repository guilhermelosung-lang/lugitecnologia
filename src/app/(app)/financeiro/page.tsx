import { requirePermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/card";
import { LancamentosTabela } from "@/components/financeiro/lancamentos-tabela";
import { NovoLancamentoForm } from "@/components/financeiro/novo-lancamento-form";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; status?: string }>;
}) {
  const context = await requirePermissao("financeiro.acessar");
  const { tipo, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("financeiro_lancamentos")
    .select("*, fornecedores(nome), obras(nome)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("data_vencimento");

  if (tipo) query = query.eq("tipo", tipo);
  if (status) query = query.eq("status", status);

  const [{ data: lancamentos }, { data: fornecedores }, { data: obras }, { data: todosAtivos }] = await Promise.all([
    query,
    supabase.from("fornecedores").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
    supabase.from("obras").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
    supabase
      .from("financeiro_lancamentos")
      .select("tipo, valor, status, data_vencimento")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null),
  ]);

  const hoje = new Date().toISOString().slice(0, 10);
  const todos = todosAtivos ?? [];
  const totalReceberPendente = todos.filter((l) => l.tipo === "receber" && l.status === "pendente").reduce((a, l) => a + Number(l.valor), 0);
  const totalPagarPendente = todos.filter((l) => l.tipo === "pagar" && l.status === "pendente").reduce((a, l) => a + Number(l.valor), 0);
  const totalAtrasado = todos.filter((l) => l.status === "pendente" && l.data_vencimento < hoje).reduce((a, l) => a + Number(l.valor), 0);
  const totalRecebidoPago = todos.filter((l) => l.status === "pago").reduce((a, l) => a + Number(l.valor), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Financeiro</h1>
        <p className="text-sm text-muted">
          Contas a receber e a pagar. Orçamentos aprovados geram uma conta a receber automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="A receber (pendente)" value={`R$ ${totalReceberPendente.toFixed(2)}`} />
        <StatCard label="A pagar (pendente)" value={`R$ ${totalPagarPendente.toFixed(2)}`} />
        <StatCard label="Atrasado" value={`R$ ${totalAtrasado.toFixed(2)}`} hint={totalAtrasado > 0 ? "Verifique os vencimentos" : undefined} />
        <StatCard label="Movimentado (pago/recebido)" value={`R$ ${totalRecebidoPago.toFixed(2)}`} />
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="tipo" defaultValue={tipo ?? ""} className="max-w-xs">
          <option value="">Todos os tipos</option>
          <option value="receber">A receber</option>
          <option value="pagar">A pagar</option>
        </Select>
        <Select name="status" defaultValue={status ?? ""} className="max-w-xs">
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="cancelado">Cancelado</option>
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      <LancamentosTabela lancamentos={lancamentos ?? []} />

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Novo lançamento manual</h2>
        <NovoLancamentoForm fornecedores={fornecedores ?? []} obras={obras ?? []} />
      </div>
    </div>
  );
}
