import Link from "next/link";

const CALCULADORAS = [
  {
    href: "/calculadoras/box",
    nome: "Box (frontal de correr)",
    desc: "Calcula vidros, perfis, acessórios e peso de um box de banheiro frontal de correr de 2 folhas.",
    disponivel: true,
  },
  {
    href: "/calculadoras/sacada",
    nome: "Sacada sem roldanas (reta, L ou U)",
    desc: "Vidros, leitos, perfis, acessórios, peso e desenho em planta de um envidraçamento de sacada — reta, em L ou em U, cada segmento calculado separadamente.",
    disponivel: true,
  },
  {
    href: "/calculadoras/porta",
    nome: "Porta de vidro",
    desc: "De abrir, pivotante, de correr ou com fixo lateral. Medida, furos, ferragens e peso.",
    disponivel: true,
  },
  {
    href: "/calculadoras/janela",
    nome: "Janela (fixa ou de correr)",
    desc: "Painel fixo ou 2 folhas de correr. Basculante, maxim-ar e veneziana ainda não disponíveis.",
    disponivel: true,
  },
  {
    href: "/peso-vidro",
    nome: "Peso e Segurança do Vidro",
    desc: "Calculadora avulsa de peso (sem precisar de kit) com alerta de manuseio e recomendação de quantas pessoas usar.",
    disponivel: true,
  },
  {
    href: "/espelhos-tampos",
    nome: "Espelhos, Tampos e Prateleiras",
    desc: "Painel plano retangular — medida, área, perímetro de borda, peso e furos de fixação.",
    disponivel: true,
  },
];

export default function CalculadorasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Calculadoras</h1>
        <p className="text-sm text-muted">Configuradores técnicos que geram medidas, lista de materiais e peso reais.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CALCULADORAS.map((c) => (
          <Link
            key={c.nome}
            href={c.disponivel ? c.href : "#"}
            aria-disabled={!c.disponivel}
            className={
              c.disponivel
                ? "rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_8px_20px_rgba(76,29,149,0.1)]"
                : "cursor-not-allowed rounded-2xl border border-dashed border-border bg-surface/60 p-5 opacity-60"
            }
          >
            <h3 className="font-heading text-base font-semibold text-primary">{c.nome}</h3>
            <p className="mt-1 text-xs text-muted">{c.desc}</p>
            {!c.disponivel && (
              <span className="mt-3 inline-block rounded-full bg-border px-2.5 py-1 text-xs text-muted">
                Em breve
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
