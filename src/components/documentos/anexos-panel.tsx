"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadDocumentoAction, excluirDocumentoAction } from "@/lib/actions/documentos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

export type AnexoItem = {
  id: string;
  nome_arquivo: string;
  tamanho_bytes: number;
  descricao: string | null;
  created_at: string;
  url: string | null;
  usuarios: { nome: string } | null;
};

function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function AnexosPanel({
  entidadeTipo,
  entidadeId,
  caminhoRevalidar,
  documentos,
  podeEditar,
}: {
  entidadeTipo: "obra" | "cliente" | "orcamento" | "fornecedor";
  entidadeId: string;
  caminhoRevalidar: string;
  documentos: AnexoItem[];
  podeEditar: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      await uploadDocumentoAction(entidadeTipo, entidadeId, caminhoRevalidar, formData);
      formRef.current?.reset();
      router.refresh();
    });
  }

  function handleRemove(id: string) {
    if (!confirm("Remover este anexo?")) return;
    startTransition(async () => {
      await excluirDocumentoAction(id, caminhoRevalidar);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Documentos e anexos</h2>

      <ul className="mb-4 space-y-2">
        {documentos.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm">
            <div className="min-w-0">
              {doc.url ? (
                <a href={doc.url} target="_blank" rel="noopener" className="truncate font-medium text-accent-dark hover:underline">
                  {doc.nome_arquivo}
                </a>
              ) : (
                <span className="truncate font-medium text-foreground">{doc.nome_arquivo}</span>
              )}
              <p className="truncate text-xs text-muted">
                {formatarTamanho(doc.tamanho_bytes)} · {doc.usuarios?.nome ?? "—"} · {formatDateTime(doc.created_at)}
                {doc.descricao ? ` · ${doc.descricao}` : ""}
              </p>
            </div>
            {podeEditar && (
              <button
                type="button"
                disabled={pending}
                onClick={() => handleRemove(doc.id)}
                className="shrink-0 text-xs font-medium text-danger hover:underline disabled:opacity-60"
              >
                Remover
              </button>
            )}
          </li>
        ))}
        {documentos.length === 0 && <li className="text-sm text-muted">Nenhum anexo ainda.</li>}
      </ul>

      {podeEditar && (
        <form ref={formRef} action={handleUpload} className="flex flex-wrap items-end gap-3">
          <div>
            <Input id="arquivo" name="arquivo" type="file" required className="mt-1.5" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <Input id="descricao" name="descricao" placeholder="Descrição (opcional)" className="mt-1.5" />
          </div>
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending ? "Enviando..." : "Anexar arquivo"}
          </Button>
        </form>
      )}
      <p className="mt-2 text-xs text-muted">Máximo de 20 MB por arquivo.</p>
    </div>
  );
}
