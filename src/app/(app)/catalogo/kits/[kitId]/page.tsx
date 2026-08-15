import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { KitItensPanel } from "@/components/catalogo/kit-itens-panel";
import { ParametrosPanel } from "@/components/catalogo/parametros-panel";
import { PontoAberturaPanel } from "@/components/catalogo/ponto-abertura-panel";
import { PARAMETROS_DEFINICAO_POR_TIPO } from "@/lib/constants";

export default async function KitDetalhePage({
  params,
}: {
  params: Promise<{ kitId: string }>;
}) {
  const { kitId } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: kit } = await supabase
    .from("kits")
    .select("*, sistemas(id, nome, tipo)")
    .eq("id", kitId)
    .eq("empresa_id", context.empresa.id)
    .maybeSingle();

  if (!kit) notFound();

  const [{ data: itens }, { data: parametros }] = await Promise.all([
    supabase.from("kit_itens").select("*").eq("kit_id", kitId).order("created_at"),
    supabase.from("parametros_calculo").select("chave, valor").eq("kit_id", kitId),
  ]);

  const definicoes = PARAMETROS_DEFINICAO_POR_TIPO[kit.sistemas?.tipo ?? ""] ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-muted">
          <Link href={`/catalogo/${kit.sistema_id}`} className="text-accent-dark hover:underline">
            {kit.sistemas?.nome}
          </Link>
        </p>
        <h1 className="font-heading text-2xl font-bold text-primary">{kit.nome}</h1>
        {kit.descricao && <p className="text-sm text-muted">{kit.descricao}</p>}
      </div>

      <KitItensPanel kitId={kit.id} itens={itens ?? []} />
      <ParametrosPanel kitId={kit.id} parametros={parametros ?? []} definicoes={definicoes} />
      <PontoAberturaPanel kitId={kit.id} aberturaPadraoLado={kit.abertura_padrao_lado} aberturaPadraoTipo={kit.abertura_padrao_tipo} />
    </div>
  );
}
