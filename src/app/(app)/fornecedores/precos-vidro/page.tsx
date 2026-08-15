import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { TIPO_VIDRO_OPCOES } from "@/lib/constants";
import { PrecoVidroActions } from "@/components/precos-vidro/preco-vidro-actions";
import { precoCustoM2, precoVendaM2 } from "@/lib/calc/vidro-utils";

const LABEL_TIPO = Object.fromEntries(TIPO_VIDRO_OPCOES.map((t) => [t.value, t.label]));

export default async function PrecosVidroPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: precos } = await supabase
    .from("tabela_precos_vidro")
    .select("*, fornecedores(nome)")
    .eq("empresa_id", context.empresa.id)
    .order("tipo_vidro")
    .order("espessura_mm");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Tabela de preços de vidro</h1>
          <p className="text-sm text-muted">
            {precos?.length ?? 0} preço(s) cadastrado(s) · usado para precificar o vidro automaticamente ao
            vincular um item de orçamento a um cálculo técnico.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/fornecedores">
            <Button variant="secondary">Voltar a Fornecedores</Button>
          </Link>
          <Link href="/fornecedores/precos-vidro/novo">
            <Button>Novo preço</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Cor</th>
              <th className="px-4 py-3">Espessura</th>
              <th className="px-4 py-3">Fornecedor</th>
              <th className="px-4 py-3">Vidro/m²</th>
              <th className="px-4 py-3">Têmpera/m²</th>
              <th className="px-4 py-3">Custo/m²</th>
              <th className="px-4 py-3">Venda sugerida/m²</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(precos ?? []).map((p) => (
              <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-background ${p.deleted_at ? "opacity-50" : ""}`}>
                <td className="px-4 py-3">
                  <Link href={`/fornecedores/precos-vidro/${p.id}`} className="font-medium text-primary hover:text-accent-dark">
                    {LABEL_TIPO[p.tipo_vidro] ?? p.tipo_vidro}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{p.cor}</td>
                <td className="px-4 py-3 text-muted">{p.espessura_mm} mm</td>
                <td className="px-4 py-3 text-muted">{p.fornecedores?.nome ?? "Genérico"}</td>
                <td className="px-4 py-3 text-muted">R$ {Number(p.preco_vidro_m2).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted">R$ {Number(p.preco_tempera_m2).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted">R$ {precoCustoM2(p).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted">R$ {precoVendaM2(p).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <PrecoVidroActions precoId={p.id} excluido={Boolean(p.deleted_at)} />
                </td>
              </tr>
            ))}
            {(!precos || precos.length === 0) && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted">
                  Nenhum preço de vidro cadastrado ainda. Cadastre pelo menos um por tipo/espessura para
                  os orçamentos precificarem o vidro automaticamente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
