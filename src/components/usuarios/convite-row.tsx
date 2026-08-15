"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelarConviteAction } from "@/lib/actions/usuarios";
import { formatDateTime } from "@/lib/utils";
import type { Tables } from "@/types/database.types";

export function ConviteRow({
  convite,
  perfilNome,
  origem,
}: {
  convite: Tables<"convites">;
  perfilNome: string;
  origem: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const link = `${origem}/convite/${convite.token}`;

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{convite.email}</p>
        <p className="max-w-xs truncate text-xs text-accent-dark">{link}</p>
      </td>
      <td className="px-4 py-3 capitalize text-muted">{perfilNome}</td>
      <td className="px-4 py-3 text-muted">{formatDateTime(convite.expira_em)}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await cancelarConviteAction(convite.id);
              router.refresh();
            })
          }
          className="text-xs font-medium text-danger hover:underline disabled:opacity-60"
        >
          Cancelar
        </button>
      </td>
    </tr>
  );
}
