"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ICONS } from "./nav-items";

const TABS = [
  { href: "/dashboard", label: "Início", icon: "grid" },
  { href: "/clientes", label: "Clientes", icon: "users" },
  { href: "/obras", label: "Obras", icon: "obra" },
  { href: "/orcamentos", label: "Orçam.", icon: "orcamento" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  let grupoAnterior: string | null = null;

  return (
    <>
      {aberto && (
        <div
          className="fixed inset-0 z-40 bg-primary-dark/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setAberto(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface shadow-[0_-8px_30px_rgba(76,29,149,0.15)] transition-transform duration-300 ease-out md:hidden",
          aberto ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <p className="font-heading text-sm font-semibold text-primary">Todos os módulos</p>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="rounded-full p-1.5 text-muted transition hover:bg-border/40 hover:text-foreground"
            aria-label="Fechar menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4 pb-8">
          {NAV_ITEMS.map((item) => {
            const novoGrupo = item.grupo !== grupoAnterior;
            grupoAnterior = item.grupo;
            return (
              <div key={item.href} className="contents">
                {novoGrupo && (
                  <p className="col-span-3 mb-0.5 mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted first:mt-0">
                    {item.grupo}
                  </p>
                )}
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-3 text-center text-xs font-medium text-foreground transition active:scale-95"
                >
                  <span className="text-accent-dark">{ICONS[item.icon]}</span>
                  <span className="leading-tight">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur md:hidden">
        {TABS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 px-2 py-2 text-center text-[11px] font-medium transition-colors",
                active ? "text-accent-dark" : "text-muted"
              )}
            >
              {ICONS[item.icon]}
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 px-2 py-2 text-center text-[11px] font-medium transition-colors",
            aberto ? "text-accent-dark" : "text-muted"
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
            <circle cx="5" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          </svg>
          Mais
        </button>
      </nav>
    </>
  );
}
