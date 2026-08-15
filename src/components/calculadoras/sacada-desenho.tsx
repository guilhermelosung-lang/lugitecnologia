import type { ResultadoSacadaReta } from "@/lib/calc/sacada";

export function SacadaDesenho({ resultado }: { resultado: ResultadoSacadaReta }) {
  const larguraTotal = resultado.paineis.length * resultado.larguraVidroMm;
  const altura = resultado.alturaAdotadaMm;
  const escala = Math.min(500 / larguraTotal, 220 / altura);
  const w = larguraTotal * escala;
  const h = altura * escala;
  const pad = 24;
  const larguraPainelPx = w / resultado.paineis.length;

  return (
    <svg
      viewBox={`0 0 ${w + pad * 2} ${h + pad * 2 + 20}`}
      className="w-full max-w-xl"
      role="img"
      aria-label="Desenho técnico da sacada"
    >
      <rect x={pad} y={pad} width={w} height={h} fill="none" stroke="#2B1364" strokeWidth={2} />
      {resultado.paineis.map((painel, i) => (
        <g key={painel.identificacao}>
          <rect
            x={pad + i * larguraPainelPx + 3}
            y={pad + 3}
            width={larguraPainelPx - 6}
            height={h - 6}
            fill={i % 2 === 0 ? "#F8F5FE" : "#F0E6FF"}
            stroke="#C4B5FD"
          />
          <text
            x={pad + i * larguraPainelPx + larguraPainelPx / 2}
            y={pad + h / 2}
            textAnchor="middle"
            fontSize={Math.min(13, larguraPainelPx / 4)}
            fill="#2B1364"
            fontWeight={600}
          >
            {painel.identificacao}
          </text>
          {i > 0 && (
            <line
              x1={pad + i * larguraPainelPx}
              y1={pad}
              x2={pad + i * larguraPainelPx}
              y2={pad + h}
              stroke="#9333EA"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
        </g>
      ))}
      <text x={pad + w / 2} y={pad + h + 16} textAnchor="middle" fontSize={11} fill="#1E1145">
        {resultado.paineis.length} × {resultado.larguraVidroMm} mm
      </text>
      <text
        x={pad - 8}
        y={pad + h / 2}
        textAnchor="middle"
        fontSize={11}
        fill="#1E1145"
        transform={`rotate(-90 ${pad - 8} ${pad + h / 2})`}
      >
        {altura} mm
      </text>
    </svg>
  );
}
