import type { BarraResultado } from "@/lib/calc/plano-corte-perfis";

export function BarraDesenho({ barra, comprimentoBarraMm }: { barra: BarraResultado; comprimentoBarraMm: number }) {
  const escala = 640 / comprimentoBarraMm;
  let cursor = 0;

  return (
    <svg viewBox={`0 0 ${comprimentoBarraMm * escala} 40`} className="w-full max-w-2xl" role="img" aria-label={`Barra ${barra.numero}`}>
      <rect x={0} y={8} width={comprimentoBarraMm * escala} height={24} fill="#F8F5FE" stroke="#2B1364" strokeWidth={1.5} />
      {barra.cortes.map((c) => {
        const x = cursor * escala;
        cursor += c.comprimentoMm;
        return (
          <g key={c.codigo}>
            <rect x={x + 1} y={9} width={c.comprimentoMm * escala - 2} height={22} fill="#E4D9FA" stroke="#9333EA" strokeWidth={1} />
            <text x={x + (c.comprimentoMm * escala) / 2} y={24} textAnchor="middle" fontSize={8} fill="#2B1364">
              {c.codigo}
            </text>
          </g>
        );
      })}
      {barra.sobraMm > 0 && (
        <rect x={cursor * escala} y={8} width={barra.sobraMm * escala} height={24} fill="#F0F0F0" stroke="#C4C4C4" strokeDasharray="3 3" />
      )}
    </svg>
  );
}
