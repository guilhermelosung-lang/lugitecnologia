"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ICONS } from "./nav-items";

export function Sidebar({ empresaNome }: { empresaNome: string }) {
  const pathname = usePathname();

  let grupoAnterior: string | null = null;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-primary md:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/95">
          <Image src="/logo-icon.png" alt="Lugi" width={36} height={36} className="h-7 w-7 object-contain" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-white">Lugi Sistemas</p>
          <p className="truncate text-xs text-white/50">{empresaNome}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2 [scrollbar-width:thin]">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const novoGrupo = item.grupo !== grupoAnterior;
          grupoAnterior = item.grupo;
          return (
            <div key={item.href}>
              {novoGrupo && (
                <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/35 first:mt-1">
                  {item.grupo}
                </p>
              )}
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:translate-x-0.5 hover:bg-white/5 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-accent-2 transition-transform duration-150",
                    active ? "scale-y-100" : "scale-y-0"
                  )}
                  aria-hidden
                />
                <span className={cn("transition-transform duration-150", !active && "group-hover:scale-110")}>
                  {ICONS[item.icon]}
                </span>
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
