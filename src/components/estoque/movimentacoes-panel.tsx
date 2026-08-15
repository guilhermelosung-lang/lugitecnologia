"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { registrarMovimentacaoAction } from "@/lib/actions/estoque";
import { MOVIMENTACAO_TIPOS } from "@/lib/constants";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@/lib/utils";

const TIPO_LABEL = Object.fromEntries(MOVIMENTACAO_TIPOS.map((t) => [t.value, t.label]));

export function MovimentacoesPanel({
  itemId,
  movimentacoes,
}: {
  itemId: string;
  movimentacoes: Tables<"movimentacoes_estoque">[];
}) {
  const [pending, startTransition] = useTransition();
  const [tipo, setTipo] = useState("entrada");
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await registrarMovimentacaoAction(itemId, formData);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Movimentações</h2>

      <div className="mb-5 max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Tipo</th>
              <th className="py-2">Quantidade</th>
              <th className="py-2">Motivo</th>
              <th className="py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0">
                <td className="py-2">{TIPO_LABEL[m.tipo] ?? m.tipo}</td>
                <td className={`py-2 font-medium ${m.quantidade < 0 ? "text-danger" : "text-success"}`}>
                  {m.quantidade > 0 ? "+" : ""}{m.quantidade}
                </td>
                <td className="py-2 text-muted">{m.motivo || "—"}</td>
                <td className="py-2 text-muted">{formatDateTime(m.created_at)}</td>
              </tr>
            ))}
            {movimentacoes.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-muted">Nenhuma movimentação registrada ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form action={handleSubmit} className="grid gap-3 md:grid-cols-4 md:items-end">
        <div>
          <Label htmlFor="tipo">Tipo</Label>
          <Select id="tipo" name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1.5">
            {MOVIMENTACAO_TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input id="quantidade" name="quantidade" type="number" step="0.001" required className="mt-1.5" />
        </div>
        {tipo === "ajuste" && (
          <div>
            <Label htmlFor="sinal">Sinal do ajuste</Label>
            <Select id="sinal" name="sinal" defaultValue="positivo" className="mt-1.5">
              <option value="positivo">Adicionar (+)</option>
              <option value="negativo">Remover (-)</option>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="motivo">Motivo</Label>
          <Input id="motivo" name="motivo" className="mt-1.5" />
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </div>
  );
}
