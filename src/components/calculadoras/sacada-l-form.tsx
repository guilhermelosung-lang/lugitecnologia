"use client";

import { useActionState } from "react";
import { calcularESalvarSacadaLAction } from "@/lib/actions/calculo-sacada";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentoCampos } from "@/components/calculadoras/sacada-segmento-campos";

type KitOption = { id: string; nome: string; sistemaNome: string };
type ObraOption = { id: string; nome: string };

export function SacadaLForm({
  kits,
  obras,
  obraIdInicial,
}: {
  kits: KitOption[];
  obras: ObraOption[];
  obraIdInicial?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    calcularESalvarSacadaLAction,
    undefined
  );

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
          <Input id="nome" name="nome" placeholder="ex: Sacada L varanda cobertura" className="mt-1.5" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Segmentos (cada um calculado separadamente — nunca some os dois vãos)
        </h3>
        <div className="space-y-4">
          <SegmentoCampos prefixo="lado_a" rotulo="Lado A (ponta na parede → encontro com Lado B)" pontaInicial="parede" pontaFinal="encontro" />
          <SegmentoCampos prefixo="lado_b" rotulo="Lado B (encontro com Lado A → ponta na parede)" pontaInicial="encontro" pontaFinal="parede" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Ponto de abertura</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="abertura_segmento">Segmento</Label>
            <Select id="abertura_segmento" name="abertura_segmento" defaultValue="B" className="mt-1.5">
              <option value="A">Lado A</option>
              <option value="B">Lado B</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="abertura_lado">Lado</Label>
            <Select id="abertura_lado" name="abertura_lado" defaultValue="direita" className="mt-1.5">
              <option value="direita">Direita</option>
              <option value="esquerda">Esquerda</option>
              <option value="central">Central</option>
              <option value="bilateral">Bilateral</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="espessura_mm">Espessura do vidro</Label>
            <Select id="espessura_mm" name="espessura_mm" defaultValue="8" className="mt-1.5">
              {[8, 10, 12].map((v) => (
                <option key={v} value={v}>{v} mm (temperado)</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted">
        Cálculo assume o encontro de canto em 90°. Apenas vidro de segurança (temperado) é aceito para
        sacadas. Não substitui projeto estrutural ou responsabilidade técnica.
      </p>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Calcular cortina em L"}
      </Button>
    </form>
  );
}
