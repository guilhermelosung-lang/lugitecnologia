"use client";

import { useActionState } from "react";
import { criarSistemaAction, atualizarSistemaAction } from "@/lib/actions/catalogo";
import { SISTEMA_TIPOS } from "@/lib/constants";
import type { ActionState } from "@/lib/actions/auth";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SistemaForm({ sistema }: { sistema?: Tables<"sistemas"> }) {
  const action = sistema ? atualizarSistemaAction.bind(null, sistema.id) : criarSistemaAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="tipo">Tipo *</Label>
          <Select id="tipo" name="tipo" required defaultValue={sistema?.tipo ?? "box"} className="mt-1.5">
            {SISTEMA_TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="nome">Nome *</Label>
          <Input id="nome" name="nome" defaultValue={sistema?.nome} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="fabricante">Fabricante</Label>
          <Input id="fabricante" name="fabricante" defaultValue={sistema?.fabricante ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="linha">Linha</Label>
          <Input id="linha" name="linha" defaultValue={sistema?.linha ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="modelo">Modelo</Label>
          <Input id="modelo" name="modelo" defaultValue={sistema?.modelo ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="versao">Versão *</Label>
          <Input id="versao" name="versao" defaultValue={sistema?.versao ?? "1"} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="espessuras_aceitas">Espessuras aceitas</Label>
          <Input id="espessuras_aceitas" name="espessuras_aceitas" placeholder="ex: 8mm, 10mm" defaultValue={sistema?.espessuras_aceitas ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="peso_maximo_kg">Peso máximo (kg)</Label>
          <Input id="peso_maximo_kg" name="peso_maximo_kg" type="number" step="0.01" min={0} defaultValue={sistema?.peso_maximo_kg ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="medida_minima_mm">Medida mínima (mm)</Label>
          <Input id="medida_minima_mm" name="medida_minima_mm" type="number" min={0} defaultValue={sistema?.medida_minima_mm ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="medida_maxima_mm">Medida máxima (mm)</Label>
          <Input id="medida_maxima_mm" name="medida_maxima_mm" type="number" min={0} defaultValue={sistema?.medida_maxima_mm ?? ""} className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea id="descricao" name="descricao" rows={3} defaultValue={sistema?.descricao ?? ""} className="mt-1.5" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : sistema ? "Salvar alterações" : "Cadastrar sistema"}
      </Button>
    </form>
  );
}
