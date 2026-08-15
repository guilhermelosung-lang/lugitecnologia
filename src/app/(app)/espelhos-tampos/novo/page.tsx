import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { EspelhoTampoForm } from "@/components/espelhos-tampos/espelho-tampo-form";

export default async function NovoEspelhoTampoPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: obras } = await supabase
    .from("obras")
    .select("id, nome")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .order("nome");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Espelhos, Tampos e Prateleiras</h1>
        <p className="text-sm text-muted">Painel plano retangular — medida, peso e acabamento de borda.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <EspelhoTampoForm obras={obras ?? []} />
      </div>
    </div>
  );
}
