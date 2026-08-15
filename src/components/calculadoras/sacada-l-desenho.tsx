import type { ResultadoSacadaL } from "@/lib/calc/sacada-l";

/** Desenho em planta (vista de cima) da cortina em L: Lado A na horizontal,
 * Lado B na vertical, encontrando-se no canto, com os painéis, códigos e a
 * seta indicando o sentido de recolhimento da abertura. */
export function SacadaLDesenho({ resultado }: { resultado: ResultadoSacadaL }) {
  const [ladoA, ladoB] = resultado.segmentos;
  const espessura = 26;
  const pad = 30;
  const escala = Math.min(380 / ladoA.larguraInformadaMm, 220 / ladoB.larguraInformadaMm);
  const wA = ladoA.larguraInformadaMm * escala;
  const hB = ladoB.larguraInformadaMm * escala;

  const larguraPainelA = wA / ladoA.paineis.length;
  const larguraPainelB = hB / ladoB.paineis.length;

  return (
    <svg
      viewBox={`0 0 ${pad * 2 + Math.max(wA, 160) + 40} ${pad * 2 + hB + 40}`}
      className="w-full max-w-xl"
      role="img"
      aria-label="Desenho em planta da cortina em L"
    >
      {/* Parede vertical (atrás do Lado B) */}
      <line x1={pad - 6} y1={pad} x2={pad - 6} y2={pad + hB + espessura} stroke="#1E1145" strokeWidth={4} />
      {/* Parede horizontal (atrás do Lado A) */}
      <line x1={pad} y1={pad - 6} x2={pad + wA + espessura} y2={pad - 6} stroke="#1E1145" strokeWidth={4} />

      {/* Lado A: barra horizontal */}
      {ladoA.paineis.map((p, i) => (
        <g key={p.codigo}>
          <rect
            x={pad + espessura + i * larguraPainelA + 2}
            y={pad + 2}
            width={larguraPainelA - 4}
            height={espessura - 4}
            fill={i % 2 === 0 ? "#F8F5FE" : "#F0E6FF"}
            stroke="#C4B5FD"
          />
          <text
            x={pad + espessura + i * larguraPainelA + larguraPainelA / 2}
            y={pad + espessura / 2 + 4}
            textAnchor="middle"
            fontSize={Math.min(10, larguraPainelA / 5)}
            fill="#2B1364"
            fontWeight={600}
          >
            {p.codigo}
          </text>
        </g>
      ))}

      {/* Lado B: barra vertical */}
      {ladoB.paineis.map((p, i) => (
        <g key={p.codigo}>
          <rect
            x={pad + 2}
            y={pad + espessura + i * larguraPainelB + 2}
            width={espessura - 4}
            height={larguraPainelB - 4}
            fill={i % 2 === 0 ? "#F8F5FE" : "#F0E6FF"}
            stroke="#C4B5FD"
          />
          <text
            x={pad + espessura / 2}
            y={pad + espessura + i * larguraPainelB + larguraPainelB / 2 + 3}
            textAnchor="middle"
            fontSize={Math.min(10, larguraPainelB / 5)}
            fill="#2B1364"
            fontWeight={600}
            transform={`rotate(-90 ${pad + espessura / 2} ${pad + espessura + i * larguraPainelB + larguraPainelB / 2})`}
          >
            {p.codigo}
          </text>
        </g>
      ))}

      {/* Canto (encontro) */}
      <rect x={pad} y={pad} width={espessura} height={espessura} fill="#9333EA" opacity={0.25} stroke="#9333EA" />
      <text x={pad + espessura / 2} y={pad + espessura + 14} textAnchor="middle" fontSize={9} fill="#6B21A8">
        canto
      </text>

      {/* Cotas */}
      <text x={pad + espessura + wA / 2} y={pad + espessura + 16} textAnchor="middle" fontSize={11} fill="#1E1145">
        Lado A: {ladoA.paineis.length} × {ladoA.larguraVidroMm} mm
      </text>
      <text
        x={pad - 12}
        y={pad + espessura + hB / 2}
        textAnchor="middle"
        fontSize={11}
        fill="#1E1145"
        transform={`rotate(-90 ${pad - 12} ${pad + espessura + hB / 2})`}
      >
        Lado B: {ladoB.paineis.length} × {ladoB.larguraVidroMm} mm
      </text>

      {/* Abertura */}
      {(() => {
        const emA = resultado.abertura.segmentoId === "A";
        const seg = emA ? ladoA : ladoB;
        const larguraPainel = emA ? larguraPainelA : larguraPainelB;
        if (resultado.abertura.lado !== "esquerda" && resultado.abertura.lado !== "direita") {
          return (
            <text x={pad + espessura + 4} y={pad + espessura + hB + 30} fontSize={10} fill="#9333EA">
              Abertura {resultado.abertura.lado} em {seg.rotulo} — definir manualmente
            </text>
          );
        }
        const idx = resultado.abertura.lado === "direita" ? seg.paineis.length : 0;
        if (emA) {
          const x = pad + espessura + idx * larguraPainel;
          const y = pad + espessura / 2;
          const dx = resultado.abertura.lado === "direita" ? 16 : -16;
          return <line x1={x} y1={y} x2={x + dx} y2={y} stroke="#9333EA" strokeWidth={2} markerEnd="url(#setaL)" />;
        }
        const x = pad + espessura / 2;
        const y = pad + espessura + idx * larguraPainel;
        const dy = resultado.abertura.lado === "direita" ? 16 : -16;
        return <line x1={x} y1={y} x2={x} y2={y + dy} stroke="#9333EA" strokeWidth={2} markerEnd="url(#setaL)" />;
      })()}
      <defs>
        <marker id="setaL" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9333EA" />
        </marker>
      </defs>
    </svg>
  );
}
