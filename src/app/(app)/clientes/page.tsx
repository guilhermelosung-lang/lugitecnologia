import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const context = await requireUsuario();
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("clientes")
    .select("*")
    .eq("empresa_id", context.empresa.id)
    .order("created_at", { ascending: false });

  if (status === "inativo") {
    query = query.not("deleted_at", "is", null);
  } else {
    query = query.is("deleted_at", null);
  }

  if (q) {
    query = query.or(
      `nome.ilike.%${q}%,cpf_cnpj.ilike.%${q}%,telefone.ilike.%${q}%,email.ilike.%${q}%`
    );
  }

  const { data: clientes, error } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Clientes</h1>
          <p className="text-sm text-muted">{clientes?.length ?? 0} cliente(s) encontrado(s)</p>
        </div>
        <Link href="/clientes/novo">
          <Button>Novo cliente</Button>
        </Link>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome, CPF/CNPJ, telefone ou e-mail"
          className="max-w-sm"
        />
        <select
          name="status"
          defaultValue={status ?? "ativo"}
          className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="ativo">Ativos</option>
          <option value="inativo">Excluídos</option>
        </select>
        <Button type="submit" variant="secondary">Filtrar</Button>
      </form>

      {error && <p className="text-sm text-danger">{error.message}</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">CPF/CNPJ</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Cidade/UF</th>
              <th className="px-4 py-3">Cadastrado em</th>
            </tr>
          </thead>
          <tbody>
            {(clientes ?? []).map((cliente) => (
              <tr key={cliente.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3">
                  <Link href={`/clientes/${cliente.id}`} className="font-medium text-primary hover:text-accent-dark">
                    {cliente.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{cliente.cpf_cnpj || "—"}</td>
                <td className="px-4 py-3 text-muted">{cliente.telefone || cliente.whatsapp || "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {cliente.cidade ? `${cliente.cidade}/${cliente.estado ?? ""}` : "—"}
                </td>
                <td className="px-4 py-3 text-muted">{formatDateTime(cliente.created_at)}</td>
              </tr>
            ))}
            {(!clientes || clientes.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
