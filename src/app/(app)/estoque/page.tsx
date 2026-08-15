import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ITEM_CATEGORIAS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIA_LABEL = Object.fromEntries(ITEM_CATEGORIAS.map((c) => [c.value, c.label]));

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; baixo?: string }>;
}) {
  const context = await requireUsuario();
  const { q, categoria, baixo } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("itens_estoque")
    .select("*")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("nome");

  if (categoria) query = query.eq("categoria", categoria);
  if (q) query = query.ilike("nome", `%${q}%`);

  const { data: itensRaw, error } = await query;
  const itens = baixo === "1"
    ? (itensRaw ?? []).filter((i) => i.quantidade_atual <= i.quantidade_minima)
    : itensRaw ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Estoque</h1>
          <p className="text-sm text-muted">{itens.length} item(ns) encontrado(s)</p>
        </div>
        <Link href="/estoque/novo">
          <Button>Novo item</Button>
        </Link>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Input name="q" defaultValue={q} placeholder="Buscar por nome" className="max-w-sm" />
        <Select name="categoria" defaultValue={categoria ?? ""} className="max-w-xs">
          <option value="">Todas as categorias</option>
          {ITEM_CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="baixo" value="1" defaultChecked={baixo === "1"} className="h-4 w-4" />
          Só estoque baixo
        </label>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      {error && <p className="text-sm text-danger">{error.message}</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Qtd. atual</th>
              <th className="px-4 py-3">Qtd. mínima</th>
              <th className="px-4 py-3">Custo unit.</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i) => {
              const baixoEstoque = i.quantidade_atual <= i.quantidade_minima;
              return (
                <tr key={i.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3">
                    <Link href={`/estoque/${i.id}`} className="font-medium text-primary hover:text-accent-dark">
                      {i.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{CATEGORIA_LABEL[i.categoria] ?? i.categoria}</td>
                  <td className={cn("px-4 py-3 font-medium", baixoEstoque ? "text-danger" : "text-foreground")}>
                    {i.quantidade_atual} {i.unidade}
                    {baixoEstoque && <span className="ml-2 rounded-full bg-danger/10 px-2 py-0.5 text-xs">baixo</span>}
                  </td>
                  <td className="px-4 py-3 text-muted">{i.quantidade_minima} {i.unidade}</td>
                  <td className="px-4 py-3 text-muted">{i.custo_unitario != null ? `R$ ${i.custo_unitario}` : "—"}</td>
                </tr>
              );
            })}
            {itens.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Nenhum item encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
