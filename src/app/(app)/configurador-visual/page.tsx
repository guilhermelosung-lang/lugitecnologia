import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BoxDesenho } from "@/components/calculadoras/box-desenho";
import { SacadaDesenho } from "@/components/calculadoras/sacada-desenho";
import { SacadaLDesenho } from "@/components/calculadoras/sacada-l-desenho";
import { SacadaUDesenho } from "@/components/calculadoras/sacada-u-desenho";
import { PortaDesenho } from "@/components/calculadoras/porta-desenho";
import { JanelaDesenho } from "@/components/calculadoras/janela-desenho";
import type { ResultadoBoxFrontalCorrer } from "@/lib/calc/box";
import type { ResultadoSacadaReta } from "@/lib/calc/sacada";
import type { ResultadoSacadaL } from "@/lib/calc/sacada-l";
import type { ResultadoSacadaU } from "@/lib/calc/sacada-u";
import type { ResultadoPorta } from "@/lib/calc/porta";
import type { ResultadoJanela } from "@/lib/calc/janela";

type Tipo = "box" | "sacada_reta" | "sacada_l" | "sacada_u" | "porta" | "janela";

const TIPO_LABEL: Record<Tipo, string> = {
  box: "Box",
  sacada_reta: "Sacada reta",
  sacada_l: "Sacada em L",
  sacada_u: "Sacada em U",
  porta: "Porta",
  janela: "Janela",
};

export default async function ConfiguradorVisualPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; id?: string }>;
}) {
  const context = await requireUsuario();
  const { tipo, id } = await searchParams;
  const supabase = await createClient();

  const [{ data: box }, { data: sacada }, { data: porta }, { data: janela }] = await Promise.all([
    supabase.from("calculos_box").select("id, nome").eq("empresa_id", context.empresa.id).order("created_at", { ascending: false }),
    supabase.from("calculos_sacada").select("id, nome, tipo_sacada").eq("empresa_id", context.empresa.id).order("created_at", { ascending: false }),
    supabase.from("calculos_porta").select("id, nome").eq("empresa_id", context.empresa.id).order("created_at", { ascending: false }),
    supabase.from("calculos_janela").select("id, nome").eq("empresa_id", context.empresa.id).order("created_at", { ascending: false }),
  ]);

  const opcoesPorTipo: Record<Tipo, { id: string; nome: string | null }[]> = {
    box: box ?? [],
    sacada_reta: (sacada ?? []).filter((s) => s.tipo_sacada === "reta"),
    sacada_l: (sacada ?? []).filter((s) => s.tipo_sacada === "l"),
    sacada_u: (sacada ?? []).filter((s) => s.tipo_sacada === "u"),
    porta: porta ?? [],
    janela: janela ?? [],
  };

  let desenho: React.ReactNode = null;
  let nomeCalculo = "";

  if (tipo && id && (tipo === "box" || tipo === "sacada_reta" || tipo === "sacada_l" || tipo === "sacada_u" || tipo === "porta" || tipo === "janela")) {
    if (tipo === "box") {
      const { data: c } = await supabase.from("calculos_box").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle();
      if (c) {
        nomeCalculo = c.nome || "Cálculo de box";
        desenho = <BoxDesenho resultado={c.resultado as unknown as ResultadoBoxFrontalCorrer} />;
      }
    } else if (tipo === "sacada_reta") {
      const { data: c } = await supabase.from("calculos_sacada").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle();
      if (c) {
        nomeCalculo = c.nome || "Cálculo de sacada";
        desenho = <SacadaDesenho resultado={c.resultado as unknown as ResultadoSacadaReta} />;
      }
    } else if (tipo === "sacada_l") {
      const { data: c } = await supabase.from("calculos_sacada").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle();
      if (c) {
        nomeCalculo = c.nome || "Cortina em L";
        desenho = <SacadaLDesenho resultado={c.resultado as unknown as ResultadoSacadaL} />;
      }
    } else if (tipo === "sacada_u") {
      const { data: c } = await supabase.from("calculos_sacada").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle();
      if (c) {
        nomeCalculo = c.nome || "Cortina em U";
        desenho = <SacadaUDesenho resultado={c.resultado as unknown as ResultadoSacadaU} />;
      }
    } else if (tipo === "porta") {
      const { data: c } = await supabase.from("calculos_porta").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle();
      if (c) {
        nomeCalculo = c.nome || "Cálculo de porta";
        desenho = (
          <PortaDesenho
            resultado={c.resultado as unknown as ResultadoPorta}
            ladoDobradica={(c.lado_dobradica as "esquerda" | "direita") ?? "direita"}
          />
        );
      }
    } else if (tipo === "janela") {
      const { data: c } = await supabase.from("calculos_janela").select("*").eq("id", id).eq("empresa_id", context.empresa.id).maybeSingle();
      if (c) {
        nomeCalculo = c.nome || "Cálculo de janela";
        desenho = <JanelaDesenho resultado={c.resultado as unknown as ResultadoJanela} />;
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Configurador Visual</h1>
        <p className="text-sm text-muted">
          Veja o desenho técnico de qualquer cálculo já feito, de qualquer calculadora, num só lugar —
          reaproveita os mesmos desenhos gerados por cada calculadora.
        </p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <Select name="tipo" defaultValue={tipo ?? ""} className="max-w-xs">
          <option value="">Escolha o tipo</option>
          {(Object.keys(TIPO_LABEL) as Tipo[]).map((t) => (
            <option key={t} value={t}>{TIPO_LABEL[t]}</option>
          ))}
        </Select>
        <Select name="id" defaultValue={id ?? ""} className="max-w-sm">
          <option value="">Escolha o cálculo</option>
          {tipo && (opcoesPorTipo[tipo as Tipo] ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.nome || "Sem identificação"}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">Ver desenho</Button>
      </form>

      {desenho ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-primary">{nomeCalculo}</h2>
          {desenho}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
          Escolha o tipo e o cálculo acima pra ver o desenho técnico.
        </p>
      )}
    </div>
  );
}
