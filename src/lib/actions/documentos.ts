"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUsuario } from "@/lib/auth/context";

const ENTIDADES = ["obra", "cliente", "orcamento", "fornecedor"] as const;
type EntidadeTipo = (typeof ENTIDADES)[number];

const TAMANHO_MAXIMO_BYTES = 20 * 1024 * 1024;

export async function uploadDocumentoAction(
  entidadeTipo: EntidadeTipo,
  entidadeId: string,
  caminhoRevalidar: string,
  formData: FormData
) {
  const context = await requireUsuario();
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    throw new Error("Selecione um arquivo.");
  }
  if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
    throw new Error("Arquivo maior que 20 MB.");
  }

  const descricao = (formData.get("descricao") as string | null)?.trim() || null;
  const supabase = await createClient();

  const nomeSanitizado = arquivo.name.replace(/[^\w.\-]+/g, "_");
  const caminho = `${context.empresa.id}/${entidadeTipo}/${entidadeId}/${Date.now()}-${nomeSanitizado}`;

  const { error: uploadError } = await supabase.storage
    .from("documentos")
    .upload(caminho, arquivo, { contentType: arquivo.type || undefined });
  if (uploadError) throw new Error(uploadError.message);

  const { error: insertError } = await supabase.from("documentos").insert({
    empresa_id: context.empresa.id,
    entidade_tipo: entidadeTipo,
    entidade_id: entidadeId,
    nome_arquivo: arquivo.name,
    caminho_storage: caminho,
    tamanho_bytes: arquivo.size,
    tipo_mime: arquivo.type || null,
    descricao,
    created_by: context.usuario.id,
  });
  if (insertError) {
    await supabase.storage.from("documentos").remove([caminho]);
    throw new Error(insertError.message);
  }

  revalidatePath(caminhoRevalidar);
}

export async function excluirDocumentoAction(documentoId: string, caminhoRevalidar: string) {
  const context = await requireUsuario();
  const supabase = await createClient();

  const { error } = await supabase
    .from("documentos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", documentoId)
    .eq("empresa_id", context.empresa.id);

  if (error) throw new Error(error.message);
  revalidatePath(caminhoRevalidar);
}
