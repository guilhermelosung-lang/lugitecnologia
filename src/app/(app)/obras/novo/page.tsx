import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ObraForm } from "@/components/obras/obra-form";

export default async function NovaObraPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string }>;
}) {
  const context = await requireUsuario();
  const { cliente } = await searchParams;
  const supabase = await createClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, nome")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("nome");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Nova obra</h1>
        <p className="text-sm text-muted">Vincule a obra a um cliente já cadastrado.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <ObraForm clientes={clientes ?? []} clienteIdInicial={cliente} />
      </div>
    </div>
  );
}
