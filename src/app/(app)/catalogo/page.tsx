import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { SISTEMA_TIPOS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

const TIPO_LABEL = Object.fromEntries(SISTEMA_TIPOS.map((t) => [t.value, t.label]));

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>;
}) {
  const context = await requireUsuario();
  const { q, tipo } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("sistemas")
    .select("*, kits(count)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("nome");

  if (tipo) query = query.eq("tipo", tipo);
  if (q) query = query.ilike("nome", `%${q}%`);

  const { data: sistemas, error } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Catálogo de Sistemas e Kits</h1>
          <p className="text-sm text-muted">{sistemas?.length ?? 0} sistema(s) cadastrado(s)</p>
        </div>
        <Link href="/catalogo/novo">
          <Button>Novo sistema</Button>
        </Link>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Input name="q" defaultValue={q} placeholder="Buscar por nome" className="max-w-sm" />
        <Select name="tipo" defaultValue={tipo ?? ""} className="max-w-xs">
          <option value="">Todos os tipos</option>
          {SISTEMA_TIPOS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      {error && <p className="text-sm text-danger">{error.message}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(sistemas ?? []).map((s) => (
          <Link
            key={s.id}
            href={`/catalogo/${s.id}`}
            className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_8px_20px_rgba(76,29,149,0.1)]"
          >
            <span className="mb-2 inline-block rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-dark">
              {TIPO_LABEL[s.tipo] ?? s.tipo}
            </span>
            <h3 className="font-heading text-base font-semibold text-primary">{s.nome}</h3>
            <p className="mt-1 text-xs text-muted">
              {s.fabricante ? `${s.fabricante} · ` : ""}v{s.versao}
            </p>
            <p className="mt-2 text-xs text-muted">
              {(s.kits as unknown as { count: number }[])?.[0]?.count ?? 0} kit(s)
            </p>
          </Link>
        ))}
        {(!sistemas || sistemas.length === 0) && (
          <p className="col-span-full py-10 text-center text-sm text-muted">Nenhum sistema cadastrado.</p>
        )}
      </div>
    </div>
  );
}
