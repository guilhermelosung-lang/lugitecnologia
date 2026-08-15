"use client";

import { useActionState, useState } from "react";
import { calcularESalvarSacadaAction } from "@/lib/actions/calculo-sacada";
import { sugerirQuantidadePaineis } from "@/lib/calc/sacada";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type KitOption = { id: string; nome: string; sistemaNome: string };
type ObraOption = { id: string; nome: string };

export function SacadaForm({
  kits,
  obras,
  obraIdInicial,
}: {
  kits: KitOption[];
  obras: ObraOption[];
  obraIdInicial?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    calcularESalvarSacadaAction,
    undefined
  );
  const [larguraTotal, setLarguraTotal] = useState<number | "">("");
  const [quantidadePaineis, setQuantidadePaineis] = useState<number | "">("");

  const sugestao = typeof larguraTotal === "number" && larguraTotal > 0 ? sugerirQuantidadePaineis(larguraTotal) : null;

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="kit_id">Kit (opcional)</Label>
          <Select id="kit_id" name="kit_id" defaultValue="" className="mt-1.5">
            <option value="">Nenhum (usar parâmetros padrão)</option>
            {kits.map((k) => (
              <option key={k.id} value={k.id}>{k.sistemaNome} — {k.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="obra_id">Obra (opcional)</Label>
          <Select id="obra_id" name="obra_id" defaultValue={obraIdInicial ?? ""} className="mt-1.5">
            <option value="">Nenhuma</option>
            {obras.map((o) => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="nome">Identificação (opcional)</Label>
          <Input id="nome" name="nome" placeholder="ex: Sacada sala 2º andar" className="mt-1.5" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Medidas do vão (mm)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="largura_total_mm">Largura total</Label>
            <Input
              id="largura_total_mm"
              name="largura_total_mm"
              type="number"
              step="1"
              min={1}
              required
              className="mt-1.5"
              onChange={(e) => setLarguraTotal(e.target.value ? Number(e.target.value) : "")}
            />
          </div>
          <div>
            <Label htmlFor="quantidade_paineis">
              Quantidade de painéis {sugestao && <span className="text-accent-dark">(sugestão: {sugestao})</span>}
            </Label>
            <Input
              id="quantidade_paineis"
              name="quantidade_paineis"
              type="number"
              step="1"
              min={1}
              required
              placeholder={sugestao ? String(sugestao) : undefined}
              value={quantidadePaineis}
              onChange={(e) => setQuantidadePaineis(e.target.value ? Number(e.target.value) : "")}
              className="mt-1.5"
            />
          </div>
        </div>
        {sugestao && (
          <button
            type="button"
            onClick={() => setQuantidadePaineis(sugestao)}
            className="mt-2 text-xs font-medium text-accent-dark hover:underline"
          >
            Usar sugestão ({sugestao} painéis de ~{Math.round((larguraTotal as number) / sugestao)} mm cada)
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Alturas (pelo menos 3 pontos, mm)
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="altura_esquerda_mm">Altura esquerda</Label>
            <Input id="altura_esquerda_mm" name="altura_esquerda_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="altura_central_mm">Altura central</Label>
            <Input id="altura_central_mm" name="altura_central_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="altura_direita_mm">Altura direita</Label>
            <Input id="altura_direita_mm" name="altura_direita_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="espessura_mm">Espessura do vidro (mm)</Label>
          <Select id="espessura_mm" name="espessura_mm" defaultValue="8" className="mt-1.5">
            {[8, 10, 12].map((v) => (
              <option key={v} value={v}>{v} mm (temperado)</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="lado_abertura">Lado da abertura</Label>
          <Select id="lado_abertura" name="lado_abertura" defaultValue="direita" className="mt-1.5">
            <option value="direita">Direita</option>
            <option value="esquerda">Esquerda</option>
            <option value="central">Central</option>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted">
        Apenas vidro de segurança (temperado) é aceito para sacadas. O cálculo automático não
        substitui projeto estrutural ou responsabilidade técnica.
      </p>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Calcular sacada"}
      </Button>
    </form>
  );
}
