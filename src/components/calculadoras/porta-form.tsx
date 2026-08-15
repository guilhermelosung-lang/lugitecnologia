"use client";

import { useActionState, useState } from "react";
import { calcularESalvarPortaAction } from "@/lib/actions/calculo-porta";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type KitOption = { id: string; nome: string; sistemaNome: string };
type ObraOption = { id: string; nome: string };
type TipoPorta = "abrir" | "pivotante" | "correr" | "com_fixo";

const TIPO_LABEL: Record<TipoPorta, string> = {
  abrir: "De abrir (dobradiças)",
  pivotante: "Pivotante (pivôs de piso/teto)",
  correr: "De correr (painel deslizante)",
  com_fixo: "De abrir com fixo lateral",
};

export function PortaForm({
  kits,
  obras,
  obraIdInicial,
}: {
  kits: KitOption[];
  obras: ObraOption[];
  obraIdInicial?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    calcularESalvarPortaAction,
    undefined
  );
  const [tipo, setTipo] = useState<TipoPorta>("abrir");
  const temDobradicas = tipo === "abrir" || tipo === "pivotante" || tipo === "com_fixo";
  const mostrarSentido = tipo === "abrir" || tipo === "com_fixo";
  const mostrarFixo = tipo === "com_fixo";

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
          <Label htmlFor="tipo_porta">Tipo de porta *</Label>
          <Select
            id="tipo_porta"
            name="tipo_porta"
            required
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPorta)}
            className="mt-1.5"
          >
            {(Object.keys(TIPO_LABEL) as TipoPorta[]).map((t) => (
              <option key={t} value={t}>{TIPO_LABEL[t]}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="nome">Identificação (opcional)</Label>
          <Input id="nome" name="nome" placeholder="ex: Porta do escritório" className="mt-1.5" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Medidas do vão (mm)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="largura_vao_mm">Largura do vão</Label>
            <Input id="largura_vao_mm" name="largura_vao_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="altura_vao_mm">Altura do vão</Label>
            <Input id="altura_vao_mm" name="altura_vao_mm" type="number" step="1" min={1} required className="mt-1.5" />
          </div>
          {mostrarFixo && (
            <div>
              <Label htmlFor="largura_fixo_mm">Largura reservada para o fixo lateral</Label>
              <Input id="largura_fixo_mm" name="largura_fixo_mm" type="number" step="1" min={1} required className="mt-1.5" />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mostrarSentido && (
          <div>
            <Label htmlFor="sentido_abertura">Sentido de abertura</Label>
            <Select id="sentido_abertura" name="sentido_abertura" defaultValue="dentro" className="mt-1.5">
              <option value="dentro">Para dentro</option>
              <option value="fora">Para fora</option>
              <option value="dupla_acao">Dupla ação (vaivém)</option>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="lado_dobradica">{tipo === "correr" ? "Lado de fechamento" : "Lado da dobradiça/pivô"}</Label>
          <Select id="lado_dobradica" name="lado_dobradica" defaultValue="direita" className="mt-1.5">
            <option value="direita">Direita</option>
            <option value="esquerda">Esquerda</option>
          </Select>
        </div>
        {temDobradicas && (
          <div>
            <Label htmlFor="quantidade_dobradicas">Quantidade de dobradiças/pivôs</Label>
            <Select id="quantidade_dobradicas" name="quantidade_dobradicas" defaultValue="2" className="mt-1.5">
              <option value="2">2</option>
              <option value="3">3</option>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="espessura_mm">Espessura do vidro (mm)</Label>
          <Select id="espessura_mm" name="espessura_mm" defaultValue="10" className="mt-1.5">
            {[8, 10, 12].map((v) => (
              <option key={v} value={v}>{v} mm (temperado)</option>
            ))}
          </Select>
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Calculando..." : "Calcular porta"}
      </Button>
    </form>
  );
}
