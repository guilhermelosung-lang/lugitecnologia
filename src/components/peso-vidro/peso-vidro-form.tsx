"use client";

import { useActionState } from "react";
import { calcularESalvarPesoVidroAction } from "@/lib/actions/calculo-peso-vidro";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ObraOption = { id: string; nome: string };

export function PesoVidroForm({ obras }: { obras: ObraOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(calcularESalvarPesoVidroAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nome">Identificação (opcional)</Label>
          <Input id="nome" name="nome" className="mt-1.5" />
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
          <Select id="espessura_mm" name="espessura_mm" defaultValue="8" className="mt-1.5">
            {[4, 5, 6, 8, 10, 12, 15, 19].map((v) => (
              <option key={v} value={v}>{v} mm</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="coeficiente_peso">Coeficiente de peso do vidro</Label>
          <Input id="coeficiente_peso" name="coeficiente_peso" type="number" step="0.1" min={0.1} defaultValue={2.5} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="tipo_instalacao">Tipo de instalação</Label>
          <Select id="tipo_instalacao" name="tipo_instalacao" defaultValue="porta_janela" className="mt-1.5">
            <option value="porta_janela">Porta/Janela</option>
            <option value="guarda_corpo">Guarda-corpo</option>
            <option value="piso">Piso</option>
            <option value="cobertura">Cobertura</option>
            <option value="outro">Outro</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="numero_pessoas">Pessoas disponíveis pro manuseio</Label>
          <Input id="numero_pessoas" name="numero_pessoas" type="number" step="1" min={0} defaultValue={1} className="mt-1.5" />
        </div>
      </div>

      <p className="text-xs text-muted">
        Coeficiente padrão (2,5) é o mesmo já usado nas outras calculadoras do sistema. Os alertas de
        peso (25 kg / 40 kg) também seguem os mesmos limiares — não usamos números de norma técnica
        não verificados.
      </p>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Calcular peso"}
      </Button>
    </form>
  );
}
