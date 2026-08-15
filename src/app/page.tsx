import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SERVICOS = [
  {
    titulo: "Sistemas sob medida",
    desc: "Plataformas web personalizadas para automatizar processos e centralizar dados do seu negócio.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    titulo: "Aplicativos",
    desc: "Apps mobile e web com foco em experiência do usuário, performance e integração.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect x="7" y="2.5" width="10" height="19" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 18.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    titulo: "Consultoria em TI",
    desc: "Diagnóstico técnico, arquitetura de sistemas e otimização de processos e custos de tecnologia.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

const MODULOS_ERP = [
  "Orçamentos e propostas",
  "Cálculos técnicos de vidro, box, porta e janela",
  "Controle de produção e pedidos de têmpera",
  "Agenda de medições e instalações",
  "Financeiro e emissão de relatórios",
  "Catálogo de kits e controle de estoque",
];

const PASSOS = [
  {
    n: "01",
    titulo: "Diagnóstico",
    desc: "Entendemos seus processos atuais, gargalos e o que sua operação realmente precisa.",
  },
  {
    n: "02",
    titulo: "Desenvolvimento",
    desc: "Construímos o sistema em ciclos curtos, com entregas visíveis desde as primeiras semanas.",
  },
  {
    n: "03",
    titulo: "Suporte contínuo",
    desc: "Acompanhamos a operação, evoluímos o produto e damos suporte direto com quem construiu.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-primary/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-sm font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95">
              <Image src="/logo-icon.png" alt="Lugi" width={32} height={32} className="h-6 w-6 object-contain" />
            </span>
            Lugi Tecnologia
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#servicos" className="transition hover:text-white">Serviços</a>
            <a href="#sistema" className="transition hover:text-white">Sistema de gestão</a>
            <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Entrar no sistema
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-primary px-6 py-24 text-white md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 55% at 88% 10%, rgba(217,70,239,.3), transparent 60%), radial-gradient(50% 50% at 8% 95%, rgba(147,51,234,.35), transparent 60%), linear-gradient(160deg, #2b1364 0%, #170936 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(60% 60% at 50% 30%, black, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-2">
            Software sob medida
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">
            Transformamos ideias em{" "}
            <span className="bg-gradient-to-r from-accent-2 via-accent to-[#c4b5fd] bg-clip-text text-transparent">
              sistemas que aceleram
            </span>{" "}
            resultados
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/70">
            Desenvolvemos aplicativos, sistemas web e soluções de gestão sob
            medida — incluindo o sistema de gestão para vidraçarias e
            esquadrias que construímos e mantemos para nossos clientes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button className="px-6 py-3 text-base">Testar grátis por 7 dias</Button>
            </Link>
            <a href="mailto:contato@lugitecnologia.com.br">
              <Button variant="outline" className="border-white/30 px-6 py-3 text-base text-white hover:bg-white/10">
                Falar com a Lugi
              </Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">
            7 dias grátis no sistema de gestão para vidraçarias e esquadrias — sem cartão de crédito.
          </p>
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-dark">O que fazemos</p>
          <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
            Serviços feitos sob medida para o seu desafio
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICOS.map((s) => (
            <div
              key={s.titulo}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-[0_2px_10px_rgba(76,29,149,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(76,29,149,0.12)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white">
                {s.icon}
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-primary">{s.titulo}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sistema" className="relative overflow-hidden bg-primary px-6 py-20 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 60% at 15% 100%, rgba(217,70,239,.25), transparent 60%), linear-gradient(160deg, #2b1364 0%, #170936 100%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-2">
              Produto próprio
            </p>
            <h2 className="font-heading text-2xl font-bold leading-tight md:text-3xl">
              Um sistema de gestão feito para vidraçarias e serralherias
            </h2>
            <p className="mt-4 text-white/70">
              Construído e mantido pela Lugi: do orçamento ao pedido de
              têmpera, com cálculos técnicos automáticos e controle completo
              da operação. Experimente 7 dias grátis no plano Profissional,
              sem compromisso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button className="px-6 py-3 text-base">Testar grátis por 7 dias</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-white/30 px-6 py-3 text-base text-white hover:bg-white/10">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
            <ul className="space-y-3">
              {MODULOS_ERP.map((m) => (
                <li key={m} className="flex items-start gap-3 text-sm text-white/85">
                  <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-2">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M6.5 10.2l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-dark">Como funciona</p>
          <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
            Da conversa inicial ao sistema em produção
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PASSOS.map((p, i) => (
            <div key={p.n} className="relative rounded-2xl border border-border bg-surface p-6">
              <span className="font-heading text-3xl font-bold text-border">{p.n}</span>
              <h3 className="mt-2 mb-2 font-heading text-lg font-semibold text-primary">{p.titulo}</h3>
              <p className="text-sm text-muted">{p.desc}</p>
              {i < PASSOS.length - 1 && (
                <svg viewBox="0 0 24 24" fill="none" className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-border md:block">
                  <path d="M4 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-accent to-accent-2 px-8 py-14 text-center text-white shadow-[0_20px_50px_rgba(147,51,234,.25)]">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Pronto para digitalizar sua vidraçaria?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Crie sua conta agora e use o sistema de gestão para vidraçarias e esquadrias por 7 dias, de graça — sem cartão de crédito.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button variant="secondary" className="px-6 py-3 text-base text-primary">
                Testar grátis por 7 dias
              </Button>
            </Link>
            <a href="mailto:contato@lugitecnologia.com.br">
              <Button variant="outline" className="border-white/40 px-6 py-3 text-base text-white hover:bg-white/10">
                Falar com a Lugi
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface px-6 py-12 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-heading text-sm font-semibold text-primary">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Image src="/logo-icon.png" alt="Lugi" width={28} height={28} className="h-5 w-5 object-contain" />
              </span>
              Lugi Tecnologia
            </div>
            <p className="mt-3 text-muted">
              Sistemas, aplicativos e consultoria em TI sob medida para o seu negócio.
            </p>
          </div>
          <div className="flex flex-wrap gap-10">
            <div>
              <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wide text-primary">Navegação</p>
              <ul className="space-y-2">
                <li><a href="#servicos" className="hover:text-accent-dark">Serviços</a></li>
                <li><a href="#sistema" className="hover:text-accent-dark">Sistema de gestão</a></li>
                <li><a href="#como-funciona" className="hover:text-accent-dark">Como funciona</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wide text-primary">Sistema</p>
              <ul className="space-y-2">
                <li><Link href="/login" className="hover:text-accent-dark">Entrar</Link></li>
                <li><Link href="/signup" className="hover:text-accent-dark">Criar conta</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wide text-primary">Contato</p>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contato@lugitecnologia.com.br" className="hover:text-accent-dark">
                    contato@lugitecnologia.com.br
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Lugi Tecnologia. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
