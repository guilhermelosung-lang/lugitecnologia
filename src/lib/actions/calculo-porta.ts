"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { calcularPorta, PARAMETROS_PORTA_PADRAO, type ParametrosPorta, type TipoPorta } from "@/lib/calc/porta";
import type { ActionState } from "@/lib/actions/auth";

const portaSchema = z.object({
  kit_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  nome: z.string().trim().optional().transform((v) => v || null),
  tipo_porta: z.enum(["abrir", "pivotante", "correr", "com_fixo"]),
  largura_vao_mm: z.coerce.number().positive("Informe a largura do vão."),
  altura_vao_mm: z.coerce.number().positive("Informe a altura do vão."),
  lado_dobradica: z.enum(["esquerda", "direita"]).default("direita"),
  sentido_abertura: z.enum(["dentro", "fora", "dupla_acao"]).default("dentro"),
  quantidade_dobradicas: z.coerce.number().default(2),
  largura_fixo_mm: z.coerce.number().optional().or(z.literal("")).transform((v) => (v ? Number(v) : null)),
  espessura_mm: z.coerce.number().positive("Informe a espessura do vidro."),
});

export async function calcularESalvarPortaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar cálculos técnicos." };
  }

  const parsed = portaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  if (dados.tipo_porta === "com_fixo" && (!dados.largura_fixo_mm || dados.largura_fixo_mm <= 0)) {
    return { error: "Informe a largura do fixo lateral." };
  }
  if ((dados.tipo_porta === "abrir" || dados.tipo_porta === "pivotante") && ![2, 3].includes(dados.quantidade_dobradicas)) {
    return { error: "Escolha 2 ou 3 dobradiças." };
  }

  const supabase = await createClient();

  let parametros: ParametrosPorta = PARAMETROS_PORTA_PADRAO;
  if (dados.kit_id) {
    const { data: parametrosRows } = await supabase
      .from("parametros_calculo")
      .select("chave, valor")
      .eq("kit_id", dados.kit_id);

    const mapa = new Map((parametrosRows ?? []).map((p) => [p.chave, Number(p.valor)]));
    parametros = {
      folgaLateralMm: mapa.get("folga_lateral_mm") ?? PARAMETROS_PORTA_PADRAO.folgaLateralMm,
      folgaAlturaMm: mapa.get("folga_altura_mm") ?? PARAMETROS_PORTA_PADRAO.folgaAlturaMm,
      distanciaDobradicaBordaMm:
        mapa.get("distancia_dobradica_borda_mm") ?? PARAMETROS_PORTA_PADRAO.distanciaDobradicaBordaMm,
      transpasseCorrerMm: mapa.get("transpasse_correr_mm") ?? PARAMETROS_PORTA_PADRAO.transpasseCorrerMm,
      coeficientePeso: mapa.get("coeficiente_peso") ?? PARAMETROS_PORTA_PADRAO.coeficientePeso,
    };
  }

  let resultado;
  try {
    resultado = calcularPorta(
      {
        tipoPorta: dados.tipo_porta as TipoPorta,
        larguraVaoMm: dados.largura_vao_mm,
        alturaVaoMm: dados.altura_vao_mm,
        ladoDobradica: dados.lado_dobradica,
        sentidoAbertura: dados.sentido_abertura,
        quantidadeDobradicas: dados.quantidade_dobradicas as 2 | 3,
        larguraFixoMm: dados.largura_fixo_mm ?? undefined,
        espessuraMm: dados.espessura_mm,
      },
      parametros
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao calcular." };
  }

  const { data, error } = await supabase
    .from("calculos_porta")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      kit_id: dados.kit_id,
      tipo_porta: dados.tipo_porta,
      nome: dados.nome,
      largura_vao_mm: dados.largura_vao_mm,
      altura_vao_mm: dados.altura_vao_mm,
      lado_dobradica: dados.lado_dobradica,
      sentido_abertura: dados.sentido_abertura,
      quantidade_dobradicas: dados.quantidade_dobradicas,
      largura_fixo_mm: dados.largura_fixo_mm,
      espessura_mm: dados.espessura_mm,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/calculadoras/porta");
  redirect(`/calculadoras/porta/${data.id}`);
}
