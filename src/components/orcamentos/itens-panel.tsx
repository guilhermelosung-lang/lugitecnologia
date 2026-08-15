"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adicionarItemOrcamentoAction, removerItemOrcamentoAction } from "@/lib/actions/orcamentos";
import {
  extrairPaineisDoCalculo,
  areaTotalM2,
  espessuraDoCalculo,
  precoCustoM2,
  precoVendaM2,
  type TipoCalculo,
} from "@/lib/calc/vidro-utils";
import { TIPO_VIDRO_OPCOES } from "@/lib/constants";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Item = Tables<"orcamento_itens">;
type CalculoOption = { id: string; nome: string | null; resultado: unknown; espessura_mm?: number | null };
type PrecoVidro = Tables<"tabela_precos_vidro"> & { fornecedores?: { nome: string } | null };

const LABEL_TIPO_CALCULO: Record<TipoCalculo, string> = {
  box: "Box",
  sacada: "Sacada",
  porta: "Porta",
  janela: "Janela",
};
const LABEL_TIPO_VIDRO = Object.fromEntries(TIPO_VIDRO_OPCOES.map((t) => [t.value, t.label]));

export function ItensPanel({
  orcamentoId,
  itens,
  calculosBox,
  calculosSacada,
  calculosPorta,
  calculosJanela,
  precosVidro,
  podeEditar,
  podeVerCusto,
}: {
  orcamentoId: string;
  itens: Item[];
  calculosBox: CalculoOption[];
  calculosSacada: CalculoOption[];
  calculosPorta: CalculoOption[];
  calculosJanela: CalculoOption[];
  precosVidro: PrecoVidro[];
  podeEditar: boolean;
  podeVerCusto: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [origem, setOrigem] = useState<"manual" | "vidro_calculo">(
    calculosBox.length + calculosSacada.length + calculosPorta.length + calculosJanela.length > 0 ? "vidro_calculo" : "manual"
  );

  const calculosPorTipo: Record<TipoCalculo, CalculoOption[]> = {
    box: calculosBox,
    sacada: calculosSacada,
    porta: calculosPorta,
    janela: calculosJanela,
  };
  const tiposDisponiveis = (Object.keys(calculosPorTipo) as TipoCalculo[]).filter((t) => calculosPorTipo[t].length > 0);

  const [calculoTipo, setCalculoTipo] = useState<TipoCalculo | "">(tiposDisponiveis[0] ?? "");
  const [calculoId, setCalculoId] = useState("");
  const [precoVidroId, setPrecoVidroId] = useState("");

  const calculoSelecionado = calculoTipo ? calculosPorTipo[calculoTipo].find((c) => c.id === calculoId) : undefined;

  const paineis = useMemo(() => {
    if (!calculoTipo || !calculoSelecionado) return [];
    return extrairPaineisDoCalculo(calculoTipo, calculoSelecionado.resultado, calculoSelecionado.espessura_mm ?? null);
  }, [calculoTipo, calculoSelecionado]);

  const areaM2 = paineis.length > 0 ? areaTotalM2(paineis) : 0;
  const espessuraCalc = paineis.length > 0 ? espessuraDoCalculo(paineis) : null;

  const precosCompatveis = precosVidro.filter((p) => p.espessura_mm === espessuraCalc);
  const precoSelecionado = precosCompatveis.find((p) => p.id === precoVidroId);

  const custoPreview = precoSelecionado ? Math.round(areaM2 * precoCustoM2(precoSelecionado) * 100) / 100 : null;
  const precoPreview = precoSelecionado ? Math.round(areaM2 * precoVendaM2(precoSelecionado) * 100) / 100 : null;

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await adicionarItemOrcamentoAction(orcamentoId, formData);
      setCalculoId("");
      setPrecoVidroId("");
      router.refresh();
    });
  }

  function handleRemove(itemId: string) {
    startTransition(async () => {
      await removerItemOrcamentoAction(itemId, orcamentoId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Itens do orçamento</h2>

      <div className="mb-5 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Descrição</th>
              <th className="py-2">Qtd.</th>
              {podeVerCusto && <th className="py-2">Custo unit.</th>}
              <th className="py-2">Preço unit.</th>
              <th className="py-2">Total</th>
              {podeEditar && <th className="py-2"></th>}
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="py-2">
                  {item.descricao}
                  {item.tabela_preco_vidro_id && (
                    <span className="ml-2 rounded-full bg-accent-dark/10 px-2 py-0.5 text-[10px] font-medium text-accent-dark">
                      vidro auto
                    </span>
                  )}
                </td>
                <td className="py-2 text-muted">{item.quantidade} {item.unidade}</td>
                {podeVerCusto && <td className="py-2 text-muted">R$ {item.custo_unitario}</td>}
                <td className="py-2 text-muted">R$ {item.preco_unitario}</td>
                <td className="py-2 font-medium text-foreground">
                  R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                </td>
                {podeEditar && (
                  <td className="py-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleRemove(item.id)}
                      className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
                    >
                      Remover
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {itens.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-muted">Nenhum item adicionado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {podeEditar && (
        <div className="space-y-4 border-t border-border pt-4">
          {tiposDisponiveis.length > 0 && (
            <div className="flex gap-2 rounded-full border border-border bg-background p-1 w-fit">
              <button
                type="button"
                onClick={() => setOrigem("vidro_calculo")}
                className={
                  origem === "vidro_calculo"
                    ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white"
                    : "rounded-full px-4 py-1.5 text-xs font-medium text-muted hover:text-foreground"
                }
              >
                Vidro de um cálculo
              </button>
              <button
                type="button"
                onClick={() => setOrigem("manual")}
                className={
                  origem === "manual"
                    ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white"
                    : "rounded-full px-4 py-1.5 text-xs font-medium text-muted hover:text-foreground"
                }
              >
                Item manual
              </button>
            </div>
          )}

          {origem === "vidro_calculo" && tiposDisponiveis.length > 0 ? (
            <form action={handleAdd} className="space-y-3">
              <input type="hidden" name="origem" value="vidro_calculo" />
              <input type="hidden" name="calculo_tipo" value={calculoTipo} />
              <input type="hidden" name="calculo_id" value={calculoId} />
              <input type="hidden" name="tabela_preco_vidro_id" value={precoVidroId} />

              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <Label htmlFor="calculo_tipo_select">Tipo de cálculo</Label>
                  <Select
                    id="calculo_tipo_select"
                    value={calculoTipo}
                    onChange={(e) => {
                      setCalculoTipo(e.target.value as TipoCalculo);
                      setCalculoId("");
                      setPrecoVidroId("");
                    }}
                    className="mt-1.5"
                  >
                    {tiposDisponiveis.map((t) => (
                      <option key={t} value={t}>{LABEL_TIPO_CALCULO[t]}</option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="calculo_id_select">Cálculo</Label>
                  <Select
                    id="calculo_id_select"
                    value={calculoId}
                    onChange={(e) => {
                      setCalculoId(e.target.value);
                      setPrecoVidroId("");
                    }}
                    className="mt-1.5"
                  >
                    <option value="">Selecione</option>
                    {calculoTipo &&
                      calculosPorTipo[calculoTipo].map((c) => (
                        <option key={c.id} value={c.id}>{c.nome || `Cálculo de ${LABEL_TIPO_CALCULO[calculoTipo]}`}</option>
                      ))}
                  </Select>
                </div>
              </div>

              {calculoId && (
                <p className="text-xs text-muted">
                  Área total de vidro: <strong className="text-foreground">{areaM2} m²</strong> · Espessura:{" "}
                  <strong className="text-foreground">{espessuraCalc ?? "—"} mm</strong>
                </p>
              )}

              {calculoId && espessuraCalc !== null && (
                <div>
                  <Label htmlFor="preco_vidro_select">Tipo de vidro (preços de {espessuraCalc}mm)</Label>
                  <Select
                    id="preco_vidro_select"
                    value={precoVidroId}
                    onChange={(e) => setPrecoVidroId(e.target.value)}
                    className="mt-1.5"
                  >
                    <option value="">Selecione</option>
                    {precosCompatveis.map((p) => (
                      <option key={p.id} value={p.id}>
                        {LABEL_TIPO_VIDRO[p.tipo_vidro] ?? p.tipo_vidro} {p.cor} — {p.fornecedores?.nome ?? "genérico"}
                      </option>
                    ))}
                  </Select>
                  {precosCompatveis.length === 0 && (
                    <p className="mt-1 text-xs text-warning">
                      Nenhum preço cadastrado para {espessuraCalc}mm. Cadastre em{" "}
                      <a href="/fornecedores/precos-vidro/novo" target="_blank" className="underline">
                        Fornecedores → Tabela de preços de vidro
                      </a>
                      .
                    </p>
                  )}
                </div>
              )}

              {precoSelecionado && (
                <p className="rounded-xl border border-accent-dark/20 bg-accent-dark/5 p-3 text-sm text-foreground">
                  {areaM2} m² × R$ {precoCustoM2(precoSelecionado).toFixed(2)}/m² (custo) ={" "}
                  <strong>R$ {custoPreview?.toFixed(2)}</strong>
                  {podeVerCusto ? "" : " "} · venda sugerida:{" "}
                  <strong>R$ {precoPreview?.toFixed(2)}</strong>
                </p>
              )}

              <div>
                <Label htmlFor="descricao_vidro">Descrição</Label>
                <Input
                  id="descricao_vidro"
                  name="descricao"
                  defaultValue={
                    calculoTipo && precoSelecionado
                      ? `Vidro ${LABEL_TIPO_VIDRO[precoSelecionado.tipo_vidro] ?? precoSelecionado.tipo_vidro} ${precoSelecionado.cor} ${precoSelecionado.espessura_mm}mm temperado`
                      : ""
                  }
                  required
                  className="mt-1.5"
                />
              </div>

              <Button type="submit" variant="secondary" disabled={pending || !calculoId || !precoVidroId}>
                {pending ? "Adicionando..." : "Adicionar vidro precificado"}
              </Button>
            </form>
          ) : (
            <form action={handleAdd} className="grid gap-3 md:grid-cols-6 md:items-end">
              <input type="hidden" name="origem" value="manual" />
              <div className="md:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" name="descricao" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="quantidade">Qtd.</Label>
                <Input id="quantidade" name="quantidade" type="number" step="0.01" min={0.01} defaultValue={1} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="unidade">Unidade</Label>
                <Input id="unidade" name="unidade" defaultValue="un" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="custo_unitario">Custo unit. (R$)</Label>
                <Input id="custo_unitario" name="custo_unitario" type="number" step="0.01" min={0} defaultValue={0} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="preco_unitario">Preço unit. (R$)</Label>
                <Input id="preco_unitario" name="preco_unitario" type="number" step="0.01" min={0} defaultValue={0} required className="mt-1.5" />
              </div>
              {calculosBox.length > 0 && (
                <div className="md:col-span-4">
                  <Label htmlFor="calculo_box_id">Vincular a um cálculo de box (opcional, sem precificar)</Label>
                  <Select id="calculo_box_id" name="calculo_box_id" defaultValue="" className="mt-1.5">
                    <option value="">Nenhum</option>
                    {calculosBox.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome || "Cálculo de box"}</option>
                    ))}
                  </Select>
                </div>
              )}
              <div className="md:col-span-2">
                <Button type="submit" variant="secondary" disabled={pending}>
                  {pending ? "Adicionando..." : "Adicionar item"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
