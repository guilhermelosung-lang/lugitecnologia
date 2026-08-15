import { requirePermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { TABELA_LABEL, ACAO_LABEL } from "@/lib/auditoria/utils";
import { AuditoriaLinha } from "@/components/auditoria/auditoria-linha";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";

const PAGE_SIZE = 50;

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ tabela?: string; acao?: string; usuario?: string; pagina?: string }>;
}) {
  const context = await requirePermissao("usuarios.gerenciar");
  const { tabela, acao, usuario, pagina } = await searchParams;
  const supabase = await createClient();

  const paginaAtual = Math.max(1, Number(pagina) || 1);
  const from = (paginaAtual - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("auditoria")
    .select("id, created_at, acao, tabela, registro_id, dados_anteriores, dados_novos, usuarios(nome)", { count: "exact" })
    .eq("empresa_id", context.empresa.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (tabela) query = query.eq("tabela", tabela);
  if (acao) query = query.eq("acao", acao);
  if (usuario) query = query.eq("usuario_id", usuario);

  const [{ data: registros, count }, { data: usuarios }] = await Promise.all([
    query,
    supabase.from("usuarios").select("id, nome").eq("empresa_id", context.empresa.id).order("nome"),
  ]);

  const totalPaginas = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const tabelasComRegistro = Object.keys(TABELA_LABEL);

  function paramsComPagina(p: number) {
    const sp = new URLSearchParams();
    if (tabela) sp.set("tabela", tabela);
    if (acao) sp.set("acao", acao);
    if (usuario) sp.set("usuario", usuario);
    sp.set("pagina", String(p));
    return `?${sp.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Auditoria</h1>
        <p className="text-sm text-muted">
          {count ?? 0} registro(s) de criação, edição e exclusão em toda a empresa — gravados
          automaticamente pelo banco de dados, não é possível apagar ou editar.
        </p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="tabela" defaultValue={tabela ?? ""} className="max-w-xs">
          <option value="">Todas as áreas</option>
          {tabelasComRegistro.map((t) => (
            <option key={t} value={t}>{TABELA_LABEL[t]}</option>
          ))}
        </Select>
        <Select name="acao" defaultValue={acao ?? ""} className="max-w-xs">
          <option value="">Todas as ações</option>
          {Object.entries(ACAO_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </Select>
        <Select name="usuario" defaultValue={usuario ?? ""} className="max-w-xs">
          <option value="">Todos os usuários</option>
          {(usuarios ?? []).map((u) => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Quando</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Área</th>
              <th className="px-4 py-3">Ação</th>
              <th className="px-4 py-3">Registro</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(registros ?? []).map((r) => (
              <AuditoriaLinha key={r.id} registro={r} tabelaLabel={TABELA_LABEL[r.tabela] ?? r.tabela} />
            ))}
            {(!registros || registros.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  Nenhum registro de auditoria encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <div className="flex gap-2">
            {paginaAtual > 1 && (
              <a href={paramsComPagina(paginaAtual - 1)}>
                <Button variant="secondary" className="px-3 py-1.5 text-xs">Anterior</Button>
              </a>
            )}
            {paginaAtual < totalPaginas && (
              <a href={paramsComPagina(paginaAtual + 1)}>
                <Button variant="secondary" className="px-3 py-1.5 text-xs">Próxima</Button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
