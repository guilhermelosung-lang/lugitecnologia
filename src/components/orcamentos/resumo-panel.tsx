"use client";

import { useActionState } from "react";
import { atualizarDescontoAction } from "@/lib/actions/orcamentos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Item = { quantidade: number; custo_unitario: number; preco_unitario: number };

export function ResumoPanel({
  orcamentoId,
  itens,
  descontoPercentual,
  descontoValor,
  podeVerCusto,
  podeVerMargem,
  podeConcederDesconto,
}: {
  orcamentoId: string;
  itens: Item[];
  descontoPercentual: number;
  descontoValor: number;
  podeVerCusto: boolean;
  podeVerMargem: boolean;
  podeConcederDesconto: boolean;
}) {
  const subtotalCusto = itens.reduce((acc, i) => acc + i.quantidade * i.custo_unitario, 0);
  const subtotalPreco = itens.reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0);
  const descontoTotal = descontoValor + (subtotalPreco * descontoPercentual) / 100;
  const precoFinal = Math.max(subtotalPreco - descontoTotal, 0);
  const lucro = precoFinal - subtotalCusto;
  const margem = precoFinal > 0 ? (lucro / precoFinal) * 100 : 0;

  const action = atualizarDescontoAction.bind(null, orcamentoId);
  const [state, formAction, pending] = useActionState<{ error?: string } | undefined, FormData>(
    async (_prev, fd) => {
      try {
        await action(fd);
        return undefined;
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Erro ao salvar desconto." };
      }
    },
    undefined
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Resumo financeiro</h2>

      <dl className="space-y-2 text-sm">
        {podeVerCusto && (
          <div className="flex justify-between">
            <dt className="text-muted">Custo total</dt>
            <dd className="text-foreground">R$ {subtotalCusto.toFixed(2)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal (preço)</dt>
          <dd className="text-foreground">R$ {subtotalPreco.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Desconto</dt>
          <dd className="text-danger">− R$ {descontoTotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
          <dt className="text-primary">Preço final</dt>
          <dd className="text-primary">R$ {precoFinal.toFixed(2)}</dd>
        </div>
        {podeVerMargem && (
          <>
            <div className="flex justify-between">
              <dt className="text-muted">Lucro</dt>
              <dd className="text-foreground">R$ {lucro.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Margem</dt>
              <dd className="text-foreground">{margem.toFixed(1)}%</dd>
            </div>
          </>
        )}
      </dl>

      {podeConcederDesconto && (
        <form action={formAction} className="mt-5 space-y-3 border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="desconto_percentual">Desconto (%)</Label>
              <Input
                id="desconto_percentual"
                name="desconto_percentual"
                type="number"
                step="0.1"
                min={0}
                max={100}
                defaultValue={descontoPercentual}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="desconto_valor">Desconto fixo (R$)</Label>
              <Input
                id="desconto_valor"
                name="desconto_valor"
                type="number"
                step="0.01"
                min={0}
                defaultValue={descontoValor}
                className="mt-1.5"
              />
            </div>
          </div>
          {state?.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending ? "Salvando..." : "Aplicar desconto"}
          </Button>
        </form>
      )}
    </div>
  );
}
