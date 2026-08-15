"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { calcularSacadaReta, PARAMETROS_SACADA_PADRAO, type ParametrosSacada } from "@/lib/calc/sacada";
import { calcularSacadaL, type SegmentoMedidaInput } from "@/lib/calc/sacada-l";
import { calcularSacadaU } from "@/lib/calc/sacada-u";
import type { ActionState } from "@/lib/actions/auth";

const sacadaSchema = z.object({
  kit_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  nome: z.string().trim().optional().transform((v) => v || null),
  largura_total_mm: z.coerce.number().positive("Informe a largura total."),
  altura_esquerda_mm: z.coerce.number().positive("Informe a altura esquerda."),
  altura_central_mm: z.coerce.number().positive("Informe a altura central."),
  altura_direita_mm: z.coerce.number().positive("Informe a altura direita."),
  quantidade_paineis: z.coerce.number().int().min(1, "Informe ao menos 1 painel."),
  espessura_mm: z.coerce.number().positive("Informe a espessura do vidro."),
  lado_abertura: z.enum(["esquerda", "direita", "central"]),
});

async function carregarParametrosSacada(
  supabase: Awaited<ReturnType<typeof createClient>>,
  kitId: string | null
): Promise<ParametrosSacada> {
  if (!kitId) return PARAMETROS_SACADA_PADRAO;

  const { data: parametrosRows } = await supabase
    .from("parametros_calculo")
    .select("chave, valor")
    .eq("kit_id", kitId);

  const mapa = new Map((parametrosRows ?? []).map((p) => [p.chave, Number(p.valor)]));
  return {
    descontoCantoneiraMm: mapa.get("desconto_cantoneira_mm") ?? PARAMETROS_SACADA_PADRAO.descontoCantoneiraMm,
    descontoGuarnicaoMm: mapa.get("desconto_guarnicao_mm") ?? PARAMETROS_SACADA_PADRAO.descontoGuarnicaoMm,
    descontoAlturaMm: mapa.get("desconto_altura_mm") ?? PARAMETROS_SACADA_PADRAO.descontoAlturaMm,
    descontoLeitoMm: mapa.get("desconto_leito_mm") ?? PARAMETROS_SACADA_PADRAO.descontoLeitoMm,
    usinagemRecuoMm: mapa.get("usinagem_recuo_mm") ?? PARAMETROS_SACADA_PADRAO.usinagemRecuoMm,
    usinagemComprimentoMm: mapa.get("usinagem_comprimento_mm") ?? PARAMETROS_SACADA_PADRAO.usinagemComprimentoMm,
    coeficientePeso: mapa.get("coeficiente_peso") ?? PARAMETROS_SACADA_PADRAO.coeficientePeso,
  };
}

export async function calcularESalvarSacadaAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar cálculos técnicos." };
  }

  const parsed = sacadaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const supabase = await createClient();
  const parametros = await carregarParametrosSacada(supabase, dados.kit_id);

  const resultado = calcularSacadaReta(
    {
      larguraTotalMm: dados.largura_total_mm,
      alturaEsquerdaMm: dados.altura_esquerda_mm,
      alturaCentralMm: dados.altura_central_mm,
      alturaDireitaMm: dados.altura_direita_mm,
      quantidadePaineis: dados.quantidade_paineis,
      espessuraMm: dados.espessura_mm,
      ladoAbertura: dados.lado_abertura,
    },
    parametros
  );

  const { data, error } = await supabase
    .from("calculos_sacada")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      kit_id: dados.kit_id,
      nome: dados.nome,
      largura_total_mm: dados.largura_total_mm,
      altura_esquerda_mm: dados.altura_esquerda_mm,
      altura_central_mm: dados.altura_central_mm,
      altura_direita_mm: dados.altura_direita_mm,
      quantidade_paineis: dados.quantidade_paineis,
      espessura_mm: dados.espessura_mm,
      lado_abertura: dados.lado_abertura,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/calculadoras/sacada");
  redirect(`/calculadoras/sacada/${data.id}`);
}

const segmentoSchema = (prefixo: string) => ({
  [`${prefixo}_largura_mm`]: z.coerce.number().positive(`Informe a largura do ${prefixo}.`),
  [`${prefixo}_altura_esquerda_mm`]: z.coerce.number().positive(`Informe a altura esquerda do ${prefixo}.`),
  [`${prefixo}_altura_central_mm`]: z.coerce.number().positive(`Informe a altura central do ${prefixo}.`),
  [`${prefixo}_altura_direita_mm`]: z.coerce.number().positive(`Informe a altura direita do ${prefixo}.`),
  [`${prefixo}_quantidade_paineis`]: z.coerce.number().int().min(1, `Informe ao menos 1 painel no ${prefixo}.`),
});

function segmentoDeCampos(dados: Record<string, unknown>, prefixo: string): SegmentoMedidaInput {
  return {
    larguraMm: dados[`${prefixo}_largura_mm`] as number,
    alturaEsquerdaMm: dados[`${prefixo}_altura_esquerda_mm`] as number,
    alturaCentralMm: dados[`${prefixo}_altura_central_mm`] as number,
    alturaDireitaMm: dados[`${prefixo}_altura_direita_mm`] as number,
    quantidadePaineis: dados[`${prefixo}_quantidade_paineis`] as number,
  };
}

const sacadaLSchema = z.object({
  kit_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  nome: z.string().trim().optional().transform((v) => v || null),
  espessura_mm: z.coerce.number().positive("Informe a espessura do vidro."),
  ...segmentoSchema("lado_a"),
  ...segmentoSchema("lado_b"),
  abertura_segmento: z.enum(["A", "B"]),
  abertura_lado: z.enum(["esquerda", "direita", "central", "bilateral"]),
});

export async function calcularESalvarSacadaLAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar cálculos técnicos." };
  }

  const parsed = sacadaLSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const supabase = await createClient();
  const parametros = await carregarParametrosSacada(supabase, dados.kit_id);

  const ladoA = segmentoDeCampos(dados, "lado_a");
  const ladoB = segmentoDeCampos(dados, "lado_b");
  const abertura = { segmentoId: dados.abertura_segmento, lado: dados.abertura_lado };

  const resultado = calcularSacadaL({ ladoA, ladoB, espessuraMm: dados.espessura_mm, abertura }, parametros);

  const { data, error } = await supabase
    .from("calculos_sacada")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      kit_id: dados.kit_id,
      nome: dados.nome,
      tipo_sacada: "l",
      espessura_mm: dados.espessura_mm,
      segmentos: [
        { id: "A", ...ladoA },
        { id: "B", ...ladoB },
      ],
      abertura,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/calculadoras/sacada");
  redirect(`/calculadoras/sacada/${data.id}`);
}

const sacadaUSchema = z.object({
  kit_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  nome: z.string().trim().optional().transform((v) => v || null),
  espessura_mm: z.coerce.number().positive("Informe a espessura do vidro."),
  ...segmentoSchema("esquerdo"),
  ...segmentoSchema("frente"),
  ...segmentoSchema("direito"),
  abertura_segmento: z.enum(["esquerdo", "frente", "direito"]),
  abertura_lado: z.enum(["esquerda", "direita", "central", "bilateral"]),
});

export async function calcularESalvarSacadaUAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar cálculos técnicos." };
  }

  const parsed = sacadaUSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const supabase = await createClient();
  const parametros = await carregarParametrosSacada(supabase, dados.kit_id);

  const ladoEsquerdo = segmentoDeCampos(dados, "esquerdo");
  const frente = segmentoDeCampos(dados, "frente");
  const ladoDireito = segmentoDeCampos(dados, "direito");
  const abertura = { segmentoId: dados.abertura_segmento, lado: dados.abertura_lado };

  const resultado = calcularSacadaU(
    { ladoEsquerdo, frente, ladoDireito, espessuraMm: dados.espessura_mm, abertura },
    parametros
  );

  const { data, error } = await supabase
    .from("calculos_sacada")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      kit_id: dados.kit_id,
      nome: dados.nome,
      tipo_sacada: "u",
      espessura_mm: dados.espessura_mm,
      segmentos: [
        { id: "esquerdo", ...ladoEsquerdo },
        { id: "frente", ...frente },
        { id: "direito", ...ladoDireito },
      ],
      abertura,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/calculadoras/sacada");
  redirect(`/calculadoras/sacada/${data.id}`);
}
