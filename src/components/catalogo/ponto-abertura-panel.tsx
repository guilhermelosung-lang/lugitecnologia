"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarPontoAberturaKitAction } from "@/lib/actions/catalogo";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PontoAberturaPanel({
  kitId,
  aberturaPadraoLado,
  aberturaPadraoTipo,
}: {
  kitId: string;
  aberturaPadraoLado: string | null;
  aberturaPadraoTipo: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await atualizarPontoAberturaKitAction(kitId, formData);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-1 font-heading text-sm font-semibold text-primary">Ponto de abertura padrão</h2>
      <p className="mb-4 text-xs text-muted">
        Preferência padrão desse kit — fica registrada aqui como referência pra quem for calcular.
      </p>
      <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="abertura_padrao_lado">Lado padrão</Label>
          <Select id="abertura_padrao_lado" name="abertura_padrao_lado" defaultValue={aberturaPadraoLado ?? ""} className="mt-1.5">
            <option value="">Não definido</option>
            <option value="esquerda">Esquerda</option>
            <option value="direita">Direita</option>
            <option value="central">Central</option>
            <option value="bilateral">Bilateral</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="abertura_padrao_tipo">Tipo padrão</Label>
          <Select id="abertura_padrao_tipo" name="abertura_padrao_tipo" defaultValue={aberturaPadraoTipo ?? ""} className="mt-1.5">
            <option value="">Não definido</option>
            <option value="corredica">Corrediça</option>
            <option value="pivotante">Pivotante</option>
            <option value="basculante">Basculante</option>
            <option value="giro">Giro</option>
            <option value="fixo">Fixo</option>
          </Select>
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </div>
  );
}
