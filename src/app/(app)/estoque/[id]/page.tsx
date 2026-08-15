import { notFound } from "next/navigation";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ItemEstoqueForm } from "@/components/estoque/item-form";
import { MovimentacoesPanel } from "@/components/estoque/movimentacoes-panel";

export default async function ItemEstoqueDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const [{ data: item }, { data: fornecedores }, { data: movimentacoes }] = await Promise.all([
    supabase.from("itens_estoque").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle(),
    supabase.from("fornecedores").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
    supabase.from("movimentacoes_estoque").select("*").eq("item_id", id).order("created_at", { ascending: false }).limit(50),
  ]);

  if (!item) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">{item.nome}</h1>
        <p className="text-sm text-muted">
          Saldo atual: <strong className="text-foreground">{item.quantidade_atual} {item.unidade}</strong>
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <ItemEstoqueForm item={item} fornecedores={fornecedores ?? []} />
      </div>

      <MovimentacoesPanel itemId={item.id} movimentacoes={movimentacoes ?? []} />
    </div>
  );
}
