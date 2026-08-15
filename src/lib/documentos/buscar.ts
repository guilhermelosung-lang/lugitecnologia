import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AnexoItem } from "@/components/documentos/anexos-panel";

/** Lista os anexos de uma entidade com uma URL assinada (válida por 1h) pra
 * cada arquivo — o bucket é privado, então não dá pra montar a URL direto. */
export async function buscarAnexos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  empresaId: string,
  entidadeTipo: "obra" | "cliente" | "orcamento" | "fornecedor",
  entidadeId: string
): Promise<AnexoItem[]> {
  const { data } = await supabase
    .from("documentos")
    .select("id, nome_arquivo, tamanho_bytes, descricao, created_at, caminho_storage, usuarios(nome)")
    .eq("empresa_id", empresaId)
    .eq("entidade_tipo", entidadeTipo)
    .eq("entidade_id", entidadeId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return Promise.all(
    (data ?? []).map(async (d) => {
      const { data: signed } = await supabase.storage.from("documentos").createSignedUrl(d.caminho_storage, 3600);
      return {
        id: d.id,
        nome_arquivo: d.nome_arquivo,
        tamanho_bytes: d.tamanho_bytes,
        descricao: d.descricao,
        created_at: d.created_at,
        usuarios: d.usuarios,
        url: signed?.signedUrl ?? null,
      };
    })
  );
}
