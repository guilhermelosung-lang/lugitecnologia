import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ItemEstoqueForm } from "@/components/estoque/item-form";

export default async function NovoItemEstoquePage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: fornecedores } = await supabase
    .from("fornecedores")
    .select("id, nome")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("nome");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Novo item de estoque</h1>
        <p className="text-sm text-muted">Cadastre um item para começar a controlar o estoque.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <ItemEstoqueForm fornecedores={fornecedores ?? []} />
      </div>
    </div>
  );
}
