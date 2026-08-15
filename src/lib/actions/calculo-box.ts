"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { calcularBoxFrontalCorrer, PARAMETROS_BOX_PADRAO, type ParametrosBox } from "@/lib/calc/box";
import type { ActionState } from "@/lib/actions/auth";

const boxSchema = z.object({
  kit_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  nome: z.string().trim().optional().transform((v) => v || null),
  largura_superior_mm: z.coerce.number().positive("Informe a largura superior."),
  largura_central_mm: z.coerce.number().positive("Informe a largura central."),
  largura_inferior_mm: z.coerce.number().positive("Informe a largura inferior."),
  altura_esquerda_mm: z.coerce.number().positive("Informe a altura esquerda."),
  altura_direita_mm: z.coerce.number().positive("Informe a altura direita."),
  espessura_mm: z.coerce.number().positive("Informe a espessura do vidro."),
  lado_abertura: z.enum(["esquerda", "direita"]),
  tipo_puxador: z.string().trim().optional().transform((v) => v || null),
});

export async function calcularESalvarBoxAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar cálculos técnicos." };
  }

  const parsed = boxSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const supabase = await createClient();

  let parametros: ParametrosBox = PARAMETROS_BOX_PADRAO;
  if (dados.kit_id) {
    const { data: parametrosRows } = await supabase
      .from("parametros_calculo")
      .select("chave, valor")
      .eq("kit_id", dados.kit_id);

    const mapa = new Map((parametrosRows ?? []).map((p) => [p.chave, Number(p.valor)]));
    parametros = {
      descontoLateralMm: mapa.get("desconto_lateral_mm") ?? PARAMETROS_BOX_PADRAO.descontoLateralMm,
      transpasseMm: mapa.get("transpasse_mm") ?? PARAMETROS_BOX_PADRAO.transpasseMm,
      folgaAlturaMm: mapa.get("folga_altura_mm") ?? PARAMETROS_BOX_PADRAO.folgaAlturaMm,
      coeficientePeso: mapa.get("coeficiente_peso") ?? PARAMETROS_BOX_PADRAO.coeficientePeso,
    };
  }

  const resultado = calcularBoxFrontalCorrer(
    {
      larguraSuperiorMm: dados.largura_superior_mm,
      larguraCentralMm: dados.largura_central_mm,
      larguraInferiorMm: dados.largura_inferior_mm,
      alturaEsquerdaMm: dados.altura_esquerda_mm,
      alturaDireitaMm: dados.altura_direita_mm,
      espessuraMm: dados.espessura_mm,
      ladoAbertura: dados.lado_abertura,
    },
    parametros
  );

  const { data, error } = await supabase
    .from("calculos_box")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      kit_id: dados.kit_id,
      nome: dados.nome,
      largura_superior_mm: dados.largura_superior_mm,
      largura_central_mm: dados.largura_central_mm,
      largura_inferior_mm: dados.largura_inferior_mm,
      altura_esquerda_mm: dados.altura_esquerda_mm,
      altura_direita_mm: dados.altura_direita_mm,
      espessura_mm: dados.espessura_mm,
      lado_abertura: dados.lado_abertura,
      tipo_puxador: dados.tipo_puxador,
      quantidade_folhas: 2,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/calculadoras/box");
  redirect(`/calculadoras/box/${data.id}`);
}
