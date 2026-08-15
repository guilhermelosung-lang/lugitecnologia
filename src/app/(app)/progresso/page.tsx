import { MODULOS_PROGRESSO, percentualModulo } from "@/lib/modulos-progresso";
import { cn } from "@/lib/utils";

function Check({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
        ok ? "bg-success/15 text-success" : "bg-border text-muted"
      )}
      aria-label={ok ? "concluído" : "pendente"}
    >
      {ok ? "✓" : "–"}
    </span>
  );
}

export default function ProgressoPage() {
  const media = Math.round(
    MODULOS_PROGRESSO.reduce((acc, m) => acc + percentualModulo(m), 0) /
      MODULOS_PROGRESSO.length
  );
  const iniciados = MODULOS_PROGRESSO.filter((m) => percentualModulo(m) > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">
          Progresso dos 36 módulos
        </h1>
        <p className="text-sm text-muted">
          Acompanhamento honesto: um módulo só marca uma coluna como concluída
          quando ela realmente existe e funciona — nada aqui é decorativo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Progresso médio</p>
          <p className="mt-2 font-heading text-2xl font-bold text-primary">{media}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Módulos iniciados</p>
          <p className="mt-2 font-heading text-2xl font-bold text-primary">
            {iniciados} / {MODULOS_PROGRESSO.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Fundação construída</p>
          <p className="mt-2 text-sm text-foreground">
            Login, empresa, usuários/permissões, clientes e dashboard com dados reais.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-border bg-background text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Módulo</th>
              <th className="px-4 py-3">%</th>
              <th className="px-4 py-3 text-center">Telas</th>
              <th className="px-4 py-3 text-center">Banco</th>
              <th className="px-4 py-3 text-center">Regras</th>
              <th className="px-4 py-3 text-center">Integrações</th>
              <th className="px-4 py-3 text-center">Testes</th>
              <th className="px-4 py-3">Pendências</th>
            </tr>
          </thead>
          <tbody>
            {MODULOS_PROGRESSO.map((m) => {
              const pct = percentualModulo(m);
              return (
                <tr key={m.numero} className="border-b border-border last:border-0 align-top">
                  <td className="px-4 py-3 text-muted">{m.numero}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{m.nome}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        pct === 0 && "bg-border text-muted",
                        pct > 0 && pct < 100 && "bg-warning/15 text-warning",
                        pct === 100 && "bg-success/15 text-success"
                      )}
                    >
                      {pct}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center"><Check ok={m.telas} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={m.banco} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={m.regras} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={m.integracoes} /></td>
                  <td className="px-4 py-3 text-center"><Check ok={m.testes} /></td>
                  <td className="px-4 py-3 max-w-xs text-xs text-muted">{m.pendencias}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
