"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario, hasPermissao } from "@/lib/auth/context";
import { calcularPlanoCorteVidro, type PecaVidro } from "@/lib/calc/plano-corte-vidro";
import { calcularPlanoCortePerfis, type PecaPerfil } from "@/lib/calc/plano-corte-perfis";
import type { ActionState } from "@/lib/actions/auth";

function parseLinhasVidro(texto: string): { pecas: PecaVidro[]; erro?: string } {
  const linhas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
  const pecas: PecaVidro[] = [];
  for (const linha of linhas) {
    const partes = linha.split(/[;,]/).map((p) => p.trim());
    if (partes.length < 3) return { pecas: [], erro: `Linha inválida: "${linha}". Use código;largura;altura;quantidade.` };
    const [codigo, larguraStr, alturaStr, qtdStr] = partes;
    const largura = Number(larguraStr);
    const altura = Number(alturaStr);
    const quantidade = qtdStr ? Number(qtdStr) : 1;
    if (!codigo || !largura || !altura || largura <= 0 || altura <= 0 || quantidade <= 0) {
      return { pecas: [], erro: `Linha inválida: "${linha}".` };
    }
    pecas.push({ codigo, larguraMm: largura, alturaMm: altura, quantidade });
  }
  return { pecas };
}

function parseLinhasPerfis(texto: string): { pecas: PecaPerfil[]; erro?: string } {
  const linhas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
  const pecas: PecaPerfil[] = [];
  for (const linha of linhas) {
    const partes = linha.split(/[;,]/).map((p) => p.trim());
    if (partes.length < 2) return { pecas: [], erro: `Linha inválida: "${linha}". Use código;comprimento;quantidade.` };
    const [codigo, comprimentoStr, qtdStr] = partes;
    const comprimento = Number(comprimentoStr);
    const quantidade = qtdStr ? Number(qtdStr) : 1;
    if (!codigo || !comprimento || comprimento <= 0 || quantidade <= 0) {
      return { pecas: [], erro: `Linha inválida: "${linha}".` };
    }
    pecas.push({ codigo, comprimentoMm: comprimento, quantidade });
  }
  return { pecas };
}

const vidroSchema = z.object({
  nome: z.string().trim().optional().transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  chapa_largura_mm: z.coerce.number().positive("Informe a largura da chapa."),
  chapa_altura_mm: z.coerce.number().positive("Informe a altura da chapa."),
  margem_mm: z.coerce.number().min(0).default(5),
  pecas_texto: z.string().trim().min(1, "Informe ao menos uma peça."),
});

export async function calcularESalvarPlanoCorteVidroAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar planos de corte." };
  }

  const parsed = vidroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const { pecas, erro } = parseLinhasVidro(dados.pecas_texto);
  if (erro) return { error: erro };

  const resultado = calcularPlanoCorteVidro(pecas, dados.chapa_largura_mm, dados.chapa_altura_mm, dados.margem_mm);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("planos_corte_vidro")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      nome: dados.nome,
      chapa_largura_mm: dados.chapa_largura_mm,
      chapa_altura_mm: dados.chapa_altura_mm,
      margem_mm: dados.margem_mm,
      pecas,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/plano-corte-vidro");
  redirect(`/plano-corte-vidro/${data.id}`);
}

const perfisSchema = z.object({
  nome: z.string().trim().optional().transform((v) => v || null),
  obra_id: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  comprimento_barra_mm: z.coerce.number().positive("Informe o comprimento da barra."),
  margem_mm: z.coerce.number().min(0).default(3),
  pecas_texto: z.string().trim().min(1, "Informe ao menos uma peça."),
});

export async function calcularESalvarPlanoCortePerfisAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const context = await requireUsuario();
  if (!hasPermissao(context, "calculos.criar")) {
    return { error: "Você não tem permissão para criar planos de corte." };
  }

  const parsed = perfisSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const dados = parsed.data;

  const { pecas, erro } = parseLinhasPerfis(dados.pecas_texto);
  if (erro) return { error: erro };

  const resultado = calcularPlanoCortePerfis(pecas, dados.comprimento_barra_mm, dados.margem_mm);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("planos_corte_perfis")
    .insert({
      empresa_id: context.empresa.id,
      obra_id: dados.obra_id,
      nome: dados.nome,
      comprimento_barra_mm: dados.comprimento_barra_mm,
      margem_mm: dados.margem_mm,
      pecas,
      resultado,
      created_by: context.usuario.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/plano-corte-perfis");
  redirect(`/plano-corte-perfis/${data.id}`);
}
