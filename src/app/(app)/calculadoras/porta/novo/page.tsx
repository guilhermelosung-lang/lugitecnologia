import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { PortaForm } from "@/components/calculadoras/porta-form";

export default async function NovoCalculoPortaPage({
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

  const kitsPorta = (kits ?? [])
    .filter((k) => k.sistemas?.tipo === "porta")
    .map((k) => ({ id: k.id, nome: k.nome, sistemaNome: k.sistemas?.nome ?? "" }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Calculadora de Porta de Vidro — Folha de abrir</h1>
        <p className="text-sm text-muted">
          Informe as medidas do vão. Escolher um kit usa os parâmetros configurados nele; sem kit, o
          cálculo usa os parâmetros padrão. Porta com bandeira ainda não está disponível.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <PortaForm kits={kitsPorta} obras={obras ?? []} obraIdInicial={obra} />
      </div>
    </div>
  );
}
