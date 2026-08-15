import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ProjetoCard } from "@/components/esquadria-serralheria/projeto-card";
import { NovoProjetoForm } from "@/components/esquadria-serralheria/novo-projeto-form";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function EsquadriasSerralheriaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; status?: string }>;
}) {
  const context = await requireUsuario();
  const { categoria, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("projetos_esquadria_serralheria")
    .select("*, obras(nome)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (categoria) query = query.eq("categoria", categoria);
  if (status) query = query.eq("status", status);

  const [{ data: projetos }, { data: obras }] = await Promise.all([
    query,
    supabase.from("obras").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
  ]);

  const podeGerenciar = hasPermissao(context, "obras.gerenciar");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Esquadrias de Alumínio e Serralheria</h1>
        <p className="text-sm text-muted">
          {projetos?.length ?? 0} projeto(s) · cadastro de projeto/item ligado à obra, sem calculadora
          automática — essas categorias são amplas demais pra ter uma fórmula única confiável, diferente
          de box/sacada/porta/janela (que têm fonte técnica verificada).
        </p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="categoria" defaultValue={categoria ?? ""} className="max-w-xs">
          <option value="">Todas as categorias</option>
          <option value="esquadria_aluminio">Esquadria de Alumínio</option>
          <option value="serralheria">Serralheria</option>
        </Select>
        <Select name="status" defaultValue={status ?? ""} className="max-w-xs">
          <option value="">Todos os status</option>
          <option value="orcamento">Orçamento</option>
          <option value="aprovado">Aprovado</option>
          <option value="em_producao">Em produção</option>
          <option value="instalado">Instalado</option>
          <option value="cancelado">Cancelado</option>
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {(projetos ?? []).map((p) => (
          <ProjetoCard key={p.id} projeto={p} podeGerenciar={podeGerenciar} />
        ))}
        {(!projetos || projetos.length === 0) && (
          <p className="text-sm text-muted md:col-span-2">Nenhum projeto cadastrado ainda.</p>
        )}
      </div>

      {podeGerenciar && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Novo projeto</h2>
          <NovoProjetoForm obras={obras ?? []} />
        </div>
      )}
    </div>
  );
}
