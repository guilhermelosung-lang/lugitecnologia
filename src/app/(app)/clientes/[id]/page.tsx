import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { ClienteActions } from "@/components/clientes/cliente-actions";
import { AnexosPanel } from "@/components/documentos/anexos-panel";
import { buscarAnexos } from "@/lib/documentos/buscar";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

const ACAO_LABEL: Record<string, string> = {
  insert: "Criação",
  update: "Edição",
  delete: "Exclusão",
};

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!cliente) notFound();

  const [{ data: historico }, { data: obras }, anexos] = await Promise.all([
    supabase
      .from("auditoria")
      .select("id, acao, created_at, usuario_id")
      .eq("tabela", "clientes")
      .eq("registro_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("obras")
      .select("id, nome, status")
      .eq("cliente_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    buscarAnexos(supabase, context.empresa.id, "cliente", id),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{cliente.nome}</h1>
          <p className="text-sm text-muted">
            {cliente.deleted_at ? "Cliente excluído" : "Cliente ativo"} · cadastrado em{" "}
            {formatDateTime(cliente.created_at)}
          </p>
        </div>
        <ClienteActions clienteId={cliente.id} excluido={Boolean(cliente.deleted_at)} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <ClienteForm cliente={cliente} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-primary">Obras</h2>
          <Link href={`/obras/novo?cliente=${cliente.id}`}>
            <Button variant="secondary" className="px-3 py-1.5 text-xs">Nova obra</Button>
          </Link>
        </div>
        <ul className="space-y-2">
          {(obras ?? []).map((o) => (
            <li key={o.id} className="flex items-center justify-between text-sm">
              <Link href={`/obras/${o.id}`} className="font-medium text-primary hover:text-accent-dark">
                {o.nome}
              </Link>
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-dark">
                {o.status}
              </span>
            </li>
          ))}
          {(!obras || obras.length === 0) && (
            <li className="text-sm text-muted">Nenhuma obra cadastrada para este cliente ainda.</li>
          )}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Histórico</h2>
        <ul className="space-y-2">
          {(historico ?? []).map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{ACAO_LABEL[item.acao] ?? item.acao}</span>
              <span className="text-muted">{formatDateTime(item.created_at)}</span>
            </li>
          ))}
          {(!historico || historico.length === 0) && (
            <li className="text-sm text-muted">Nenhum evento registrado ainda.</li>
          )}
        </ul>
      </div>

      <AnexosPanel
        entidadeTipo="cliente"
        entidadeId={cliente.id}
        caminhoRevalidar={`/clientes/${cliente.id}`}
        documentos={anexos}
        podeEditar={hasPermissao(context, "clientes.editar")}
      />
    </div>
  );
}
