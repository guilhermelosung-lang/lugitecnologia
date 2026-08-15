import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { ObraForm } from "@/components/obras/obra-form";
import { ObraActions } from "@/components/obras/obra-actions";
import { AmbientesPanel } from "@/components/obras/ambientes-panel";
import { AnexosPanel } from "@/components/documentos/anexos-panel";
import { buscarAnexos } from "@/lib/documentos/buscar";
import { criarOrcamentoAction } from "@/lib/actions/orcamentos";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export default async function ObraDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await requireUsuario();
  const supabase = await createClient();

  const [
    { data: obra },
    { data: clientes },
    { data: ambientes },
    { data: medicoes },
    { data: calculosBox },
    { data: calculosSacada },
    { data: calculosPorta },
    { data: calculosJanela },
    { data: orcamentos },
    anexos,
  ] = await Promise.all([
    supabase.from("obras").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle(),
    supabase.from("clientes").select("id, nome").eq("empresa_id", context.empresa.id).is("deleted_at", null).order("nome"),
    supabase.from("ambientes").select("*").eq("obra_id", id).order("created_at"),
    supabase.from("medicoes").select("*").eq("obra_id", id).order("created_at", { ascending: false }),
    supabase.from("calculos_box").select("id, nome, created_at").eq("obra_id", id).order("created_at", { ascending: false }),
    supabase.from("calculos_sacada").select("id, nome, created_at").eq("obra_id", id).order("created_at", { ascending: false }),
    supabase.from("calculos_porta").select("id, nome, created_at").eq("obra_id", id).order("created_at", { ascending: false }),
    supabase.from("calculos_janela").select("id, nome, created_at").eq("obra_id", id).order("created_at", { ascending: false }),
    supabase.from("orcamentos").select("id, numero, status, created_at").eq("obra_id", id).order("numero", { ascending: false }),
    buscarAnexos(supabase, context.empresa.id, "obra", id),
  ]);

  const calculosTecnicos = [
    ...(calculosBox ?? []).map((c) => ({ ...c, tipo: "box" as const })),
    ...(calculosSacada ?? []).map((c) => ({ ...c, tipo: "sacada" as const })),
    ...(calculosPorta ?? []).map((c) => ({ ...c, tipo: "porta" as const })),
    ...(calculosJanela ?? []).map((c) => ({ ...c, tipo: "janela" as const })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const medicoesPorAmbiente: Record<string, NonNullable<typeof medicoes>> = {};
  for (const m of medicoes ?? []) {
    medicoesPorAmbiente[m.ambiente_id] = [...(medicoesPorAmbiente[m.ambiente_id] ?? []), m];
  }

  const NOME_PADRAO_POR_TIPO = {
    box: "Cálculo de box",
    sacada: "Cálculo de sacada",
    porta: "Cálculo de porta",
    janela: "Cálculo de janela",
  };

  if (!obra) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{obra.nome}</h1>
          <p className="text-sm text-muted">
            {obra.deleted_at ? "Obra excluída" : "Obra ativa"} · criada em {formatDateTime(obra.created_at)} ·{" "}
            <Link href={`/clientes/${obra.cliente_id}`} className="text-accent-dark hover:underline">
              ver cliente
            </Link>
          </p>
        </div>
        <ObraActions obraId={obra.id} excluida={Boolean(obra.deleted_at)} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <ObraForm obra={obra} clientes={clientes ?? []} />
      </div>

      <AmbientesPanel obraId={obra.id} ambientes={ambientes ?? []} medicoesPorAmbiente={medicoesPorAmbiente} />

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-sm font-semibold text-primary">Cálculos técnicos</h2>
          <div className="flex gap-2">
            <Link href={`/calculadoras/box/novo?obra=${obra.id}`}>
              <Button variant="secondary" className="px-3 py-1.5 text-xs">Calcular box</Button>
            </Link>
            <Link href={`/calculadoras/sacada/novo?obra=${obra.id}`}>
              <Button variant="secondary" className="px-3 py-1.5 text-xs">Calcular sacada</Button>
            </Link>
            <Link href={`/calculadoras/porta/novo?obra=${obra.id}`}>
              <Button variant="secondary" className="px-3 py-1.5 text-xs">Calcular porta</Button>
            </Link>
            <Link href={`/calculadoras/janela/novo?obra=${obra.id}`}>
              <Button variant="secondary" className="px-3 py-1.5 text-xs">Calcular janela</Button>
            </Link>
          </div>
        </div>
        <ul className="space-y-2">
          {calculosTecnicos.map((c) => (
            <li key={c.id} className="flex items-center justify-between text-sm">
              <Link href={`/calculadoras/${c.tipo}/${c.id}`} className="font-medium text-primary hover:text-accent-dark">
                {c.nome || NOME_PADRAO_POR_TIPO[c.tipo]}
              </Link>
              <span className="text-muted">{formatDateTime(c.created_at)}</span>
            </li>
          ))}
          {calculosTecnicos.length === 0 && (
            <li className="text-sm text-muted">Nenhum cálculo técnico feito para esta obra ainda.</li>
          )}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-primary">Orçamentos</h2>
          <form action={criarOrcamentoAction.bind(null, obra.id)}>
            <Button type="submit" variant="secondary" className="px-3 py-1.5 text-xs">
              Novo orçamento
            </Button>
          </form>
        </div>
        <ul className="space-y-2">
          {(orcamentos ?? []).map((o) => (
            <li key={o.id} className="flex items-center justify-between text-sm">
              <Link href={`/orcamentos/${o.id}`} className="font-medium text-primary hover:text-accent-dark">
                Orçamento #{o.numero}
              </Link>
              <span className="text-muted">{o.status}</span>
            </li>
          ))}
          {(!orcamentos || orcamentos.length === 0) && (
            <li className="text-sm text-muted">Nenhum orçamento criado para esta obra ainda.</li>
          )}
        </ul>
      </div>

      <AnexosPanel
        entidadeTipo="obra"
        entidadeId={obra.id}
        caminhoRevalidar={`/obras/${obra.id}`}
        documentos={anexos}
        podeEditar={hasPermissao(context, "obras.gerenciar")}
      />
    </div>
  );
}
