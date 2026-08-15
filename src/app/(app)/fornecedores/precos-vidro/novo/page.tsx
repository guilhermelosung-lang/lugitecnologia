import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { PrecoVidroForm } from "@/components/precos-vidro/preco-vidro-form";

export default async function NovoPrecoVidroPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: fornecedores } = await supabase
    .from("fornecedores")
    .select("id, nome")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("nome");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Novo preço de vidro</h1>
        <p className="text-sm text-muted">Um preço por combinação de tipo, cor, espessura e fornecedor.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <PrecoVidroForm fornecedores={fornecedores ?? []} />
      </div>
    </div>
  );
}
