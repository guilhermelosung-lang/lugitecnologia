import { notFound } from "next/navigation";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { SistemaForm } from "@/components/catalogo/sistema-form";
import { KitsPanel } from "@/components/catalogo/kits-panel";

export default async function SistemaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const [{ data: sistema }, { data: kits }] = await Promise.all([
    supabase.from("sistemas").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle(),
    supabase.from("kits").select("*").eq("sistema_id", id).is("deleted_at", null).order("nome"),
  ]);

  if (!sistema) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">{sistema.nome}</h1>
        <p className="text-sm text-muted">Versão {sistema.versao}</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <SistemaForm sistema={sistema} />
      </div>

      <KitsPanel sistemaId={sistema.id} kits={kits ?? []} />
    </div>
  );
}
