import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { JanelaForm } from "@/components/calculadoras/janela-form";

export default async function NovoCalculoJanelaPage({
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

  const kitsJanela = (kits ?? [])
    .filter((k) => k.sistemas?.tipo === "janela")
    .map((k) => ({ id: k.id, nome: k.nome, sistemaNome: k.sistemas?.nome ?? "" }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Calculadora de Janelas</h1>
        <p className="text-sm text-muted">
          Fixa (painel único) ou de correr (2 folhas). Escolher um kit usa os parâmetros configurados
          nele; sem kit, o cálculo usa os parâmetros padrão. Basculante, maxim-ar e veneziana ainda
          não estão disponíveis.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <JanelaForm kits={kitsJanela} obras={obras ?? []} obraIdInicial={obra} />
      </div>
    </div>
  );
}
