"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/clientes", label: "Clientes", icon: "users" },
  { href: "/obras", label: "Obras", icon: "obra" },
  { href: "/producao", label: "Produção", icon: "producao" },
  { href: "/pedidos-tempera", label: "Pedidos de Têmpera", icon: "tempera" },
  { href: "/comparador-fornecedores", label: "Comparador de Fornecedores", icon: "comparador" },
  { href: "/plano-corte-vidro", label: "Plano de Corte de Vidro", icon: "corte" },
  { href: "/plano-corte-perfis", label: "Plano de Corte de Perfis", icon: "corte" },
  { href: "/beneficiamentos", label: "Beneficiamentos", icon: "beneficiamento" },
  { href: "/esquadrias-serralheria", label: "Esquadrias e Serralheria", icon: "esquadria" },
  { href: "/agenda", label: "Agenda e Instalações", icon: "agenda" },
  { href: "/garantia", label: "Garantia e Pós-venda", icon: "garantia" },
  { href: "/orcamentos", label: "Orçamentos", icon: "orcamento" },
  { href: "/calculadoras", label: "Calculadoras", icon: "calculadora" },
  { href: "/configurador-visual", label: "Configurador Visual", icon: "visual" },
  { href: "/catalogo", label: "Catálogo", icon: "catalogo" },
  { href: "/estoque", label: "Estoque", icon: "estoque" },
  { href: "/financeiro", label: "Financeiro", icon: "financeiro" },
  { href: "/relatorios", label: "Relatórios", icon: "grafico" },
  { href: "/fornecedores", label: "Fornecedores", icon: "fornecedor" },
  { href: "/usuarios", label: "Usuários", icon: "user-cog" },
  { href: "/empresa", label: "Empresa", icon: "building" },
  { href: "/planos", label: "Planos e Assinatura", icon: "estrela" },
  { href: "/auditoria", label: "Auditoria", icon: "shield" },
  { href: "/progresso", label: "Progresso dos Módulos", icon: "list-check" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 8.2a3.2 3.2 0 010 6.2M19 20c0-2.6-1.7-4.8-4-5.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  "user-cog": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="17" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M18 13.6v.9M18 19.5v.9M14.6 17h.9M20.5 17h.9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="4" y="3" width="12" height="18" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 7h1M8 11h1M8 15h1M12 7h1M12 11h1M12 15h1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 10h4v11h-4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  "list-check": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12l1.5 1.5L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18l1.5 1.5L8 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6h8M12 12h8M12 18h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  obra: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M3 21h18M5 21V9l7-5 7 5v12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 21v-6h4v6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  catalogo: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3" y="4" width="8" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="4" width="8" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="8" height="6" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="14" width="8" height="6" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  estoque: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11v10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  orcamento: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M6 2h9l3 3v17H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 2v3h3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 11h6M9 14h6M9 17h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  calculadora: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8.5" cy="11" r="1" fill="currentColor" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
      <circle cx="15.5" cy="11" r="1" fill="currentColor" />
      <circle cx="8.5" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="15.5" cy="15" r="1" fill="currentColor" />
    </svg>
  ),
  visual: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  esquadria: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  beneficiamento: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 21l7-7M14 21l7-7-7-7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  corte: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3" y="3" width="18" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h11M14 9l4-4M14 9l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  tempera: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M9 3h6v7l4 8a2 2 0 01-1.8 3H6.8A2 2 0 015 18l4-8V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 3h6M6.5 15h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  comparador: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M8 3v18M16 3v18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l4-4 4 4M20 17l-4 4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  producao: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3" y="4" width="5" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="9.5" y="4" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="16" y="4" width="5" height="13" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  agenda: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1.2" fill="currentColor" />
      <circle cx="12" cy="14" r="1.2" fill="currentColor" />
    </svg>
  ),
  garantia: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  grafico: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M4 20V10M11 20V4M18 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  financeiro: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v10M9.5 9.3c0-1.3 1.1-2.1 2.5-2.1s2.5.8 2.5 2c0 1.4-1.2 1.8-2.5 2.2-1.3.4-2.5.9-2.5 2.3 0 1.2 1.1 2 2.5 2s2.5-.8 2.5-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  estrela: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  fornecedor: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M3 10l1.5-5h15L21 10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 10h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

export function Sidebar({ empresaNome }: { empresaNome: string }) {
  const pathname = usePathname();

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
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {ICONS[item.icon]}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
