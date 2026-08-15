"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarUsuarioAction } from "@/lib/actions/usuarios";
import type { Tables } from "@/types/database.types";

export function UsuarioRow({
  usuario,
  perfis,
  isSelf,
}: {
  usuario: Tables<"usuarios">;
  perfis: Tables<"perfis">[];
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function alterarPerfil(perfilId: string) {
    const formData = new FormData();
    formData.set("perfil_id", perfilId);
    formData.set("ativo", String(usuario.ativo));
    startTransition(async () => {
      await atualizarUsuarioAction(usuario.id, formData);
      router.refresh();
    });
  }

  function alternarAtivo() {
    const formData = new FormData();
    formData.set("perfil_id", usuario.perfil_id);
    formData.set("ativo", String(!usuario.ativo));
    startTransition(async () => {
      await atualizarUsuarioAction(usuario.id, formData);
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{usuario.nome}</p>
        <p className="text-xs text-muted">{usuario.email}</p>
      </td>
      <td className="px-4 py-3">
        <select
          defaultValue={usuario.perfil_id}
          disabled={pending || isSelf}
          onChange={(e) => alterarPerfil(e.target.value)}
          className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm capitalize disabled:opacity-60"
        >
          {perfis.map((p) => (
            <option key={p.id} value={p.id} className="capitalize">
              {p.nome}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={alternarAtivo}
          disabled={pending || isSelf}
          className={
            usuario.ativo
              ? "rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success disabled:opacity-60"
              : "rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger disabled:opacity-60"
          }
        >
          {usuario.ativo ? "Ativo" : "Inativo"}
        </button>
      </td>
    </tr>
  );
}
