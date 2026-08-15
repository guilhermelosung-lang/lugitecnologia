import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { BoxForm } from "@/components/calculadoras/box-form";

export default async function NovoCalculoBoxPage({
  searchParams,
}: {
  searchParams: Promise<{ obra?: string }>;
}) {
  const context = await requireUsuario();
  const { obra } = await searchParams;
  const supabase = await createClient();

  const [{ data: kits }, { data: obras }] = await Promise.all([
    supabase
      .from("kits")
      .select("id, nome, sistemas(nome, tipo)")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .order("nome"),
    supabase
      .from("obras")
      .select("id, nome")
      .eq("empresa_id", context.empresa.id)
      .is("deleted_at", null)
      .order("nome"),
  ]);

  const kitsBox = (kits ?? [])
    .filter((k) => k.sistemas?.tipo === "box")
    .map((k) => ({ id: k.id, nome: k.nome, sistemaNome: k.sistemas?.nome ?? "" }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Calculadora de Box — Frontal de Correr</h1>
        <p className="text-sm text-muted">
          Informe as medidas do vão. Escolher um kit usa os parâmetros configurados nele; sem kit, o
          cálculo usa os parâmetros padrão.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <BoxForm kits={kitsBox} obras={obras ?? []} obraIdInicial={obra} />
      </div>
    </div>
  );
}
