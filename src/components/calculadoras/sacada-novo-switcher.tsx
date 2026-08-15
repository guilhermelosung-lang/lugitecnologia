"use client";

import { useState } from "react";
import { SacadaForm } from "@/components/calculadoras/sacada-form";
import { SacadaLForm } from "@/components/calculadoras/sacada-l-form";
import { SacadaUForm } from "@/components/calculadoras/sacada-u-form";

type KitOption = { id: string; nome: string; sistemaNome: string };
type ObraOption = { id: string; nome: string };

const FORMATOS = [
  { id: "reta", label: "Reta" },
  { id: "l", label: "Em L" },
  { id: "u", label: "Em U" },
] as const;

type Formato = (typeof FORMATOS)[number]["id"];

export function SacadaNovoSwitcher({
  kits,
  obras,
  obraIdInicial,
}: {
  kits: KitOption[];
  obras: ObraOption[];
  obraIdInicial?: string;
}) {
  const [formato, setFormato] = useState<Formato>("reta");

  return (
    <div>
      <div className="mb-6 flex gap-2 rounded-full border border-border bg-background p-1 w-fit">
        {FORMATOS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFormato(f.id)}
            className={
              formato === f.id
                ? "rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white"
                : "rounded-full px-4 py-1.5 text-sm font-medium text-muted hover:text-foreground"
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        {formato === "reta" && <SacadaForm kits={kits} obras={obras} obraIdInicial={obraIdInicial} />}
        {formato === "l" && <SacadaLForm kits={kits} obras={obras} obraIdInicial={obraIdInicial} />}
        {formato === "u" && <SacadaUForm kits={kits} obras={obras} obraIdInicial={obraIdInicial} />}
      </div>
    </div>
  );
}
