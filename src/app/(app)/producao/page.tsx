import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ProducaoBoard } from "@/components/producao/producao-board";
import { ETAPAS_PRODUCAO } from "@/lib/constants";

export default async function ProducaoPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: obras } = await supabase
    .from("obras")
    .select("id, nome, status, data_prevista, clientes(nome)")
    .eq("empresa_id", context.empresa.id)
    .is("deleted_at", null)
    .in("status", ETAPAS_PRODUCAO.map((e) => e.value))
    .order("data_prevista", { ascending: true, nullsFirst: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Produção</h1>
        <p className="text-sm text-muted">
          {obras?.length ?? 0} obra(s) em produção — reaproveita o status real da obra (mesmo campo usado em
          Obras), sem duplicar dado.
        </p>
      </div>

      <ProducaoBoard obras={obras ?? []} podeMover={hasPermissao(context, "obras.gerenciar")} />
    </div>
  );
}
