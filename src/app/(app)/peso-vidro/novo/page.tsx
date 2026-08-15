import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { PesoVidroForm } from "@/components/peso-vidro/peso-vidro-form";

export default async function NovoPesoVidroPage() {
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
        <h1 className="font-heading text-2xl font-bold text-primary">Peso e Segurança do Vidro</h1>
        <p className="text-sm text-muted">
          Calculadora avulsa — não precisa vir de um kit ou sistema específico. Útil pra conferir peso de
          uma peça de vidro isolada antes de manusear.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <PesoVidroForm obras={obras ?? []} />
      </div>
    </div>
  );
}
