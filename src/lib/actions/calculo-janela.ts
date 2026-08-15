"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { calcularJanela, PARAMETROS_JANELA_PADRAO, type ParametrosJanela, type TipoJanela } from "@/lib/calc/janela";
import type { ActionState } from "@/lib/actions/auth";

const janelaSchema = z.object({
  kit_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  nome: z.string().trim().optional().transform((v) => v || null),
  tipo_janela: z.enum(["fixa", "correr"]),
  largura_vao_mm: z.coerce.number().positive("Informe a largura do vão."),
  altura_vao_mm: z.coerce.number().positive("Informe a altura do vão."),
  espessura_mm: z.coerce.number().positive("Informe a espessura do vidro."),
});

export async function calcularESalvarJanelaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar cálculos técnicos." };
  }

  const parsed = janelaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const supabase = await createClient();

  let parametros: ParametrosJanela = PARAMETROS_JANELA_PADRAO;
  if (dados.kit_id) {
    const { data: parametrosRows } = await supabase
      .from("parametros_calculo")
      .select("chave, valor")
      .eq("kit_id", dados.kit_id);

    const mapa = new Map((parametrosRows ?? []).map((p) => [p.chave, Number(p.valor)]));
    parametros = {
      descontoLateralMm: mapa.get("desconto_lateral_mm") ?? PARAMETROS_JANELA_PADRAO.descontoLateralMm,
      descontoAlturaMm: mapa.get("desconto_altura_mm") ?? PARAMETROS_JANELA_PADRAO.descontoAlturaMm,
      transpasseMm: mapa.get("transpasse_mm") ?? PARAMETROS_JANELA_PADRAO.transpasseMm,
      coeficientePeso: mapa.get("coeficiente_peso") ?? PARAMETROS_JANELA_PADRAO.coeficientePeso,
    };
  }

  const resultado = calcularJanela(
    {
      tipoJanela: dados.tipo_janela as TipoJanela,
      larguraVaoMm: dados.largura_vao_mm,
      alturaVaoMm: dados.altura_vao_mm,
      espessuraMm: dados.espessura_mm,
    },
    parametros
  );

  const { data, error } = await supabase
    .from("calculos_janela")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      kit_id: dados.kit_id,
      tipo_janela: dados.tipo_janela,
      nome: dados.nome,
      largura_vao_mm: dados.largura_vao_mm,
      altura_vao_mm: dados.altura_vao_mm,
      quantidade_folhas: resultado.paineis.length,
      espessura_mm: dados.espessura_mm,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/calculadoras/janela");
  redirect(`/calculadoras/janela/${data.id}`);
}
