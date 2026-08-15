"use client";

import { useActionState } from "react";
import { calcularESalvarBoxAction } from "@/lib/actions/calculo-box";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type KitOption = { id: string; nome: string; sistemaNome: string };
type ObraOption = { id: string; nome: string };

export function BoxForm({
  kits,
  obras,
  obraIdInicial,
}: {
  kits: KitOption[];
  obras: ObraOption[];
  obraIdInicial?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    calcularESalvarBoxAction,
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
          <Input id="nome" name="nome" placeholder="ex: Banheiro suíte" className="mt-1.5" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Medidas do vão (mm)
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="largura_superior_mm">Largura superior</Label>
            <Input id="largura_superior_mm" name="largura_superior_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="largura_central_mm">Largura central</Label>
            <Input id="largura_central_mm" name="largura_central_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="largura_inferior_mm">Largura inferior</Label>
            <Input id="largura_inferior_mm" name="largura_inferior_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="altura_esquerda_mm">Altura esquerda</Label>
            <Input id="altura_esquerda_mm" name="altura_esquerda_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="altura_direita_mm">Altura direita</Label>
            <Input id="altura_direita_mm" name="altura_direita_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="espessura_mm">Espessura do vidro (mm)</Label>
          <Select id="espessura_mm" name="espessura_mm" defaultValue="8" className="mt-1.5">
            {[6, 8, 10].map((v) => (
              <option key={v} value={v}>{v} mm</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="lado_abertura">Lado da abertura</Label>
          <Select id="lado_abertura" name="lado_abertura" defaultValue="direita" className="mt-1.5">
            <option value="direita">Direita</option>
            <option value="esquerda">Esquerda</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="tipo_puxador">Tipo de puxador</Label>
          <Select id="tipo_puxador" name="tipo_puxador" defaultValue="barra" className="mt-1.5">
            <option value="barra">Barra</option>
            <option value="concha">Concha</option>
            <option value="perfil">Perfil</option>
          </Select>
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Calcular box"}
      </Button>
    </form>
  );
}
