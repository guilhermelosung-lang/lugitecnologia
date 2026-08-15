import { notFound } from "next/navigation";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { PrecoVidroForm } from "@/components/precos-vidro/preco-vidro-form";
import { PrecoVidroActions } from "@/components/precos-vidro/preco-vidro-actions";

export default async function PrecoVidroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const [{ data: preco }, { data: fornecedores }] = await Promise.all([
    supabase.from("tabela_precos_vidro").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle(),
    supabase.from("fornecedores").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
  ]);

  if (!preco) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Editar preço de vidro</h1>
          <p className="text-sm text-muted">{preco.deleted_at ? "Excluído" : "Ativo"}</p>
        </div>
        <PrecoVidroActions precoId={preco.id} excluido={Boolean(preco.deleted_at)} />
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <PrecoVidroForm preco={preco} fornecedores={fornecedores ?? []} />
      </div>
    </div>
  );
}
