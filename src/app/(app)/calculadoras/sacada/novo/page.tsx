import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { SacadaNovoSwitcher } from "@/components/calculadoras/sacada-novo-switcher";

export default async function NovoCalculoSacadaPage({
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

  const kitsSacada = (kits ?? [])
    .filter((k) => k.sistemas?.tipo === "sacada")
    .map((k) => ({ id: k.id, nome: k.nome, sistemaNome: k.sistemas?.nome ?? "" }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Calculadora de Sacada sem roldanas</h1>
        <p className="text-sm text-muted">
          Escolha o formato do envidraçamento. Reta é um vão único; L e U calculam cada segmento
          separadamente, nunca somando os vãos. Escolher um kit usa os parâmetros configurados nele;
          sem kit, o cálculo usa os parâmetros padrão.
        </p>
      </div>
      <SacadaNovoSwitcher kits={kitsSacada} obras={obras ?? []} obraIdInicial={obra} />
    </div>
  );
}
