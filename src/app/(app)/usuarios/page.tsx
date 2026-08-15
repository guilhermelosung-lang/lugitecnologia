import { headers } from "next/headers";
import { requireUsuario } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { InviteForm } from "@/components/usuarios/invite-form";
import { UsuarioRow } from "@/components/usuarios/usuario-row";
import { ConviteRow } from "@/components/usuarios/convite-row";

export default async function UsuariosPage() {
  const context = await requireUsuario();
  const supabase = await createClient();
  const headerList = await headers();
  const origem = `${headerList.get("x-forwarded-proto") ?? "http"}://${headerList.get("host")}`;

  const [{ data: usuarios }, { data: perfis }, { data: convites }] = await Promise.all([
    supabase.from("usuarios").select("*").eq("empresa_id", context.empresa.id).order("nome"),
    supabase.from("perfis").select("*").eq("empresa_id", context.empresa.id).order("nome"),
    supabase
      .from("convites")
      .select("*")
      .eq("empresa_id", context.empresa.id)
      .is("usado_em", null)
      .order("created_at", { ascending: false }),
  ]);

  const perfisPorId = new Map((perfis ?? []).map((p) => [p.id, p.nome]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Usuários e Permissões</h1>
        <p className="text-sm text-muted">{usuarios?.length ?? 0} usuário(s) na empresa</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-primary">Convidar novo usuário</h2>
        <InviteForm perfis={perfis ?? []} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(usuarios ?? []).map((u) => (
              <UsuarioRow
                key={u.id}
                usuario={u}
                perfis={perfis ?? []}
                isSelf={u.id === context.usuario.id}
              />
            ))}
          </tbody>
        </table>
      </div>

      {convites && convites.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-sm font-semibold text-primary">Convites pendentes</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">E-mail / Link</th>
                  <th className="px-4 py-3">Perfil</th>
                  <th className="px-4 py-3">Expira em</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {convites.map((c) => (
                  <ConviteRow
                    key={c.id}
                    convite={c}
                    perfilNome={perfisPorId.get(c.perfil_id) ?? "—"}
                    origem={origem}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
