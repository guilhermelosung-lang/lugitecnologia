"use client";

import { useActionState } from "react";
import { calcularESalvarEspelhoTampoAction } from "@/lib/actions/calculo-espelho-tampo";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };

export function EspelhoTampoForm({ obras }: { obras: ObraOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(calcularESalvarEspelhoTampoAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="tipo">Tipo *</Label>
          <Select id="tipo" name="tipo" defaultValue="espelho" className="mt-1.5">
            <option value="espelho">Espelho</option>
            <option value="tampo">Tampo</option>
            <option value="prateleira">Prateleira</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="obra_id">Obra (opcional)</Label>
          <Select id="obra_id" name="obra_id" defaultValue="" className="mt-1.5">
            <option value="">Nenhuma</option>
            {obras.map((o) => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="nome">Identificação (opcional)</Label>
          <Input id="nome" name="nome" placeholder="ex: Espelho banheiro social" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="largura_mm">Largura (mm) *</Label>
          <Input id="largura_mm" name="largura_mm" type="number" step="1" min={1} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="altura_mm">Altura (mm) *</Label>
          <Input id="altura_mm" name="altura_mm" type="number" step="1" min={1} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="espessura_mm">Espessura (mm) *</Label>
          <Select id="espessura_mm" name="espessura_mm" defaultValue="4" className="mt-1.5">
            {[3, 4, 6, 8, 10, 15, 20, 30].map((v) => (
              <option key={v} value={v}>{v} mm</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="acabamento_borda">Acabamento de borda</Label>
          <Select id="acabamento_borda" name="acabamento_borda" defaultValue="lapidada" className="mt-1.5">
            <option value="lapidada">Lapidada</option>
            <option value="polida">Polida</option>
            <option value="boleada">Boleada</option>
            <option value="sem_acabamento">Sem acabamento</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="coeficiente_peso">Coeficiente de peso</Label>
          <Input id="coeficiente_peso" name="coeficiente_peso" type="number" step="0.1" min={0.1} defaultValue={2.5} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="quantidade_furos_fixacao">Furos de fixação</Label>
          <Input id="quantidade_furos_fixacao" name="quantidade_furos_fixacao" type="number" step="1" min={0} defaultValue={0} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Calcular"}
      </Button>
    </form>
  );
}
