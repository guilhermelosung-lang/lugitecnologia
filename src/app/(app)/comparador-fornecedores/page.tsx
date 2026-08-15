import Link from "next/link";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { TIPO_VIDRO_OPCOES } from "@/lib/constants";
import { precoCustoM2 } from "@/lib/calc/vidro-utils";

const LABEL_TIPO = Object.fromEntries(TIPO_VIDRO_OPCOES.map((t) => [t.value, t.label]));

export default async function ComparadorFornecedoresPage() {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { data: precos } = await supabase
    .from("tabela_precos_vidro")
    .select("*, fornecedores(nome)")
    .eq("empresa_id", context.empresa.id)
    .eq("ativo", true)
    .is("deleted_at", null)
    .order("tipo_vidro")
    .order("espessura_mm");

  const grupos = new Map<string, typeof precos>();
  for (const p of precos ?? []) {
    const chave = `${p.tipo_vidro}__${p.cor}__${p.espessura_mm}`;
    grupos.set(chave, [...(grupos.get(chave) ?? []), p]);
  }

  const gruposComparaveis = Array.from(grupos.entries())
    .map(([chave, itens]) => {
      const [tipo_vidro, cor, espessura_mm] = chave.split("__");
      const ordenados = [...(itens ?? [])].sort((a, b) => precoCustoM2(a) - precoCustoM2(b));
      return { tipo_vidro, cor, espessura_mm, itens: ordenados };
    })
    .filter((g) => g.itens.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Comparador de Fornecedores</h1>
        <p className="text-sm text-muted">
          Compara o custo por m² (vidro + têmpera) de cada fornecedor para a mesma combinação de
          tipo, cor e espessura — a partir da{" "}
          <Link href="/fornecedores/precos-vidro" className="text-accent-dark hover:underline">
            tabela de preços de vidro
          </Link>
          .
        </p>
      </div>

      {gruposComparaveis.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
          Nenhum preço cadastrado ainda.
        </p>
      )}

      <div className="space-y-4">
        {gruposComparaveis.map((g) => (
          <div key={`${g.tipo_vidro}-${g.cor}-${g.espessura_mm}`} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-3 font-heading text-sm font-semibold text-primary">
              {LABEL_TIPO[g.tipo_vidro] ?? g.tipo_vidro} {g.cor} — {g.espessura_mm}mm
            </h2>
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="py-2">Fornecedor</th>
                  <th className="py-2">Vidro/m²</th>
                  <th className="py-2">Têmpera/m²</th>
                  <th className="py-2">Custo total/m²</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {g.itens.map((p, i) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="py-2 font-medium text-foreground">{p.fornecedores?.nome ?? "Genérico"}</td>
                    <td className="py-2 text-muted">R$ {Number(p.preco_vidro_m2).toFixed(2)}</td>
                    <td className="py-2 text-muted">R$ {Number(p.preco_tempera_m2).toFixed(2)}</td>
                    <td className="py-2 font-medium text-foreground">R$ {precoCustoM2(p).toFixed(2)}</td>
                    <td className="py-2">
                      {i === 0 && g.itens.length > 1 && (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Mais barato</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
