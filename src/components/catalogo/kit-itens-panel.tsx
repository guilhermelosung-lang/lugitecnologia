"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { criarKitItemAction, excluirKitItemAction } from "@/lib/actions/catalogo";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIPO_LABEL: Record<string, string> = {
  perfil: "Perfil",
  acessorio: "Acessório",
  vidro: "Vidro",
  outro: "Outro",
};

export function KitItensPanel({ kitId, itens }: { kitId: string; itens: Tables<"kit_itens">[] }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await criarKitItemAction(kitId, formData);
      router.refresh();
    });
  }

  function handleDelete(itemId: string) {
    startTransition(async () => {
      await excluirKitItemAction(itemId, kitId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Itens do kit (perfis, acessórios, vidros)</h2>

      <div className="mb-5 overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Descrição</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Qtd. padrão</th>
              <th className="py-2">Unidade</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="py-2">{item.descricao}</td>
                <td className="py-2 text-muted">{TIPO_LABEL[item.tipo] ?? item.tipo}</td>
                <td className="py-2 text-muted">{item.quantidade_padrao}</td>
                <td className="py-2 text-muted">{item.unidade}</td>
                <td className="py-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => handleDelete(item.id)}
                    className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
            {itens.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-muted">Nenhum item cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form action={handleCreate} className="grid gap-3 md:grid-cols-5 md:items-end">
        <div className="md:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input id="descricao" name="descricao" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="tipo">Tipo</Label>
          <Select id="tipo" name="tipo" defaultValue="acessorio" className="mt-1.5">
            <option value="perfil">Perfil</option>
            <option value="acessorio">Acessório</option>
            <option value="vidro">Vidro</option>
            <option value="outro">Outro</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantidade_padrao">Qtd. padrão</Label>
          <Input id="quantidade_padrao" name="quantidade_padrao" type="number" step="0.001" min={0} defaultValue={1} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="unidade">Unidade</Label>
          <Input id="unidade" name="unidade" defaultValue="un" className="mt-1.5" />
        </div>
        <div className="md:col-span-5">
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending ? "Adicionando..." : "Adicionar item"}
          </Button>
        </div>
      </form>
    </div>
  );
}
