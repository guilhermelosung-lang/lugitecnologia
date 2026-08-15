import type { ResultadoSegmento } from "@/lib/calc/sacada-segmento";

/** Vista frontal (elevação) de um único segmento — largura x altura, com os
 * painéis e a usinagem de saída, quando houver. */
export function SegmentoElevacao({ segmento }: { segmento: ResultadoSegmento }) {
  const larguraTotal = segmento.paineis.length * segmento.larguraVidroMm;
  const altura = segmento.alturaVidroMm;
  const escala = Math.min(440 / larguraTotal, 180 / altura);
  const w = larguraTotal * escala;
  const h = altura * escala;
  const pad = 20;
  const larguraPainelPx = w / segmento.paineis.length;

  return (
    <svg
      viewBox={`0 0 ${w + pad * 2} ${h + pad * 2 + 18}`}
      className="w-full max-w-lg"
      role="img"
      aria-label={`Desenho técnico do ${segmento.rotulo}`}
    >
      <rect x={pad} y={pad} width={w} height={h} fill="none" stroke="#2B1364" strokeWidth={2} />
      {segmento.paineis.map((painel, i) => (
        <g key={painel.codigo}>
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
            fontSize={Math.min(12, larguraPainelPx / 4)}
            fill="#2B1364"
            fontWeight={600}
          >
            {painel.codigo}
          </text>
          {painel.usinagem && (
            <g>
              <line
                x1={pad + (i + (painel.usinagem.lado === "direita" ? 1 : 0)) * larguraPainelPx}
                y1={pad + h + 4}
                x2={
                  pad +
                  (i + (painel.usinagem.lado === "direita" ? 1 : 0)) * larguraPainelPx +
                  (painel.usinagem.lado === "direita" ? -1 : 1) * 14
                }
                y2={pad + h + 4}
                stroke="#9333EA"
                strokeWidth={2}
                markerEnd="url(#seta)"
              />
            </g>
          )}
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
      <defs>
        <marker id="seta" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9333EA" />
        </marker>
      </defs>
      <text x={pad + w / 2} y={pad + h + 16} textAnchor="middle" fontSize={10} fill="#1E1145">
        {segmento.rotulo}: {segmento.paineis.length} × {segmento.larguraVidroMm} mm
      </text>
    </svg>
  );
}
