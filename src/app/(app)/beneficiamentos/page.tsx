import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { CatalogoItem } from "@/components/beneficiamentos/catalogo-item";
import { NovoCatalogoForm } from "@/components/beneficiamentos/novo-catalogo-form";
import { NovoLancamentoForm } from "@/components/beneficiamentos/novo-lancamento-form";
import { LancamentoLinha } from "@/components/beneficiamentos/lancamento-linha";

export default async function BeneficiamentosPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const [{ data: catalogo }, { data: lancamentos }, { data: obras }] = await Promise.all([
    supabase
      .from("beneficiamentos_catalogo")
      .select("*")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .order("nome"),
    supabase
      .from("beneficiamentos_lancamentos")
      .select("*, beneficiamentos_catalogo(nome), obras(nome)")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("obras").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
  ]);

  const podeGerenciarCatalogo = hasPermissao(context, "catalogo.gerenciar");
  const podeRegistrar = hasPermissao(context, "calculos.criar");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Beneficiamentos, Furos e Recortes</h1>
        <p className="text-sm text-muted">
          Catálogo de serviços de beneficiamento e registro de onde cada um foi aplicado.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Catálogo</h2>
        <ul className="mb-4 space-y-2">
          {(catalogo ?? []).map((item) => (
            <CatalogoItem key={item.id} item={item} podeGerenciar={podeGerenciarCatalogo} />
          ))}
          {(!catalogo || catalogo.length === 0) && <li className="text-sm text-muted">Nenhum item cadastrado ainda.</li>}
        </ul>
        {podeGerenciarCatalogo && <NovoCatalogoForm />}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Registros</h2>
        <div className="mb-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2">Beneficiamento</th>
                <th className="px-4 py-2">Obra</th>
                <th className="px-4 py-2">Peça/local</th>
                <th className="px-4 py-2">Qtd.</th>
                <th className="px-4 py-2">Quando</th>
                {podeRegistrar && <th className="px-4 py-2"></th>}
              </tr>
            </thead>
            <tbody>
              {(lancamentos ?? []).map((l) => (
                <LancamentoLinha key={l.id} lancamento={l} podeGerenciar={podeRegistrar} />
              ))}
              {(!lancamentos || lancamentos.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">Nenhum registro ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {podeRegistrar && catalogo && catalogo.length > 0 && (
          <NovoLancamentoForm catalogo={catalogo} obras={obras ?? []} />
        )}
        {podeRegistrar && (!catalogo || catalogo.length === 0) && (
          <p className="text-sm text-muted">Cadastre pelo menos um item no catálogo acima antes de registrar.</p>
        )}
      </div>
    </div>
  );
}
