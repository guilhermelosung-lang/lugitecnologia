import { notFound } from "next/navigation";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { FornecedorForm } from "@/components/fornecedores/fornecedor-form";
import { FornecedorActions } from "@/components/fornecedores/fornecedor-actions";
import { AnexosPanel } from "@/components/documentos/anexos-panel";
import { buscarAnexos } from "@/lib/documentos/buscar";
import { formatDateTime } from "@/lib/utils";

export default async function FornecedorDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: fornecedor } = await supabase
    .from("fornecedores")
    .select("*")
    .eq("id", id)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!fornecedor) notFound();

  const anexos = await buscarAnexos(supabase, context.empresa.id, "fornecedor", id);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{fornecedor.nome}</h1>
          <p className="text-sm text-muted">
            {fornecedor.deleted_at ? "Fornecedor excluído" : "Fornecedor ativo"} · cadastrado em{" "}
            {formatDateTime(fornecedor.created_at)}
          </p>
        </div>
        <FornecedorActions fornecedorId={fornecedor.id} excluido={Boolean(fornecedor.deleted_at)} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <FornecedorForm fornecedor={fornecedor} />
      </div>

      <AnexosPanel
        entidadeTipo="fornecedor"
        entidadeId={fornecedor.id}
        caminhoRevalidar={`/fornecedores/${fornecedor.id}`}
        documentos={anexos}
        podeEditar={hasPermissao(context, "fornecedores.gerenciar")}
      />
    </div>
  );
}
