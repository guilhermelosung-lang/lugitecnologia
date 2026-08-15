"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { salvarParametroKitAction } from "@/lib/actions/parametros-calculo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Definicao = { chave: string; descricao: string; padrao: number };

export function ParametrosPanel({
  kitId,
  parametros,
  definicoes,
}: {
  kitId: string;
  parametros: { chave: string; valor: number }[];
  definicoes: readonly Definicao[];
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [editando, setEditando] = useState<string | null>(null);
  const mapa = new Map(parametros.map((p) => [p.chave, p.valor]));

  function salvar(chave: string, descricao: string, formData: FormData) {
    formData.set("chave", chave);
    formData.set("descricao", descricao);
    startTransition(async () => {
      await salvarParametroKitAction(kitId, formData);
      setEditando(null);
      router.refresh();
    });
  }

  if (definicoes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-1 font-heading text-sm font-semibold text-primary">
        Parâmetros de cálculo (Motor de Regras)
      </h2>
      <p className="mb-4 text-xs text-muted">
        Esses valores alimentam a calculadora deste kit. Nenhum valor fica preso no código — cada
        cálculo salvo guarda uma cópia dos parâmetros usados no momento.
      </p>
      <ul className="space-y-2">
        {definicoes.map((def) => {
          const valorAtual = mapa.get(def.chave) ?? def.padrao;
          const usandoPadrao = !mapa.has(def.chave);
          return (
            <li key={def.chave} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
              <div>
                <p className="font-medium text-foreground">{def.descricao}</p>
                {usandoPadrao && <p className="text-xs text-muted">usando valor padrão</p>}
              </div>
              {editando === def.chave ? (
                <form
                  action={(fd) => salvar(def.chave, def.descricao, fd)}
                  className="flex items-center gap-2"
                >
                  <Input
                    name="valor"
                    type="number"
                    step="0.01"
                    defaultValue={valorAtual}
                    className="w-24"
                    autoFocus
                  />
                  <Button type="submit" variant="secondary" className="px-2.5 py-1.5 text-xs" disabled={pending}>
                    Salvar
                  </Button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditando(def.chave)}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark hover:bg-accent/20"
                >
                  {valorAtual} {def.chave === "coeficiente_peso" ? "" : "mm"} · editar
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
