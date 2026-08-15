import type { ChapaResultado } from "@/lib/calc/plano-corte-vidro";

export function ChapaDesenho({
  chapa,
  chapaLarguraMm,
  chapaAlturaMm,
}: {
  chapa: ChapaResultado;
  chapaLarguraMm: number;
  chapaAlturaMm: number;
}) {
  const escala = Math.min(500 / chapaLarguraMm, 320 / chapaAlturaMm);
  const w = chapaLarguraMm * escala;
  const h = chapaAlturaMm * escala;
  const pad = 12;

  return (
    <svg viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`} className="w-full max-w-lg" role="img" aria-label={`Chapa ${chapa.numero}`}>
      <rect x={pad} y={pad} width={w} height={h} fill="#F8F5FE" stroke="#2B1364" strokeWidth={2} />
      {chapa.pecas.map((p) => (
        <g key={p.codigo}>
          <rect
            x={pad + p.x * escala}
            y={pad + p.y * escala}
            width={p.larguraMm * escala}
            height={p.alturaMm * escala}
            fill="#E4D9FA"
            stroke="#9333EA"
            strokeWidth={1}
          />
          <text
            x={pad + p.x * escala + (p.larguraMm * escala) / 2}
            y={pad + p.y * escala + (p.alturaMm * escala) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="#2B1364"
          >
            {p.codigo}
          </text>
        </g>
      ))}
    </svg>
  );
}
