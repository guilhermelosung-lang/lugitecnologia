"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Início" },
  { href: "/clientes", label: "Clientes" },
  { href: "/obras", label: "Obras" },
  { href: "/orcamentos", label: "Orçam." },
  { href: "/calculadoras", label: "Calc." },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface md:hidden">
      {ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 px-2 py-2.5 text-center text-xs font-medium",
              active ? "text-accent-dark" : "text-muted"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
