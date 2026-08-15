import type { ResultadoSacadaU } from "@/lib/calc/sacada-u";

/** Desenho em planta (vista de cima) da cortina em U: Lado Esquerdo e Lado
 * Direito na vertical, Frente na horizontal ligando os dois, com os
 * painéis, códigos e a seta do ponto de abertura. */
export function SacadaUDesenho({ resultado }: { resultado: ResultadoSacadaU }) {
  const [esquerdo, frente, direito] = resultado.segmentos;
  const espessura = 26;
  const pad = 30;
  const escala = Math.min(
    170 / esquerdo.larguraInformadaMm,
    340 / frente.larguraInformadaMm,
    170 / direito.larguraInformadaMm
  );
  const hEsq = esquerdo.larguraInformadaMm * escala;
  const wFrente = frente.larguraInformadaMm * escala;
  const hDir = direito.larguraInformadaMm * escala;
  const alturaMaxima = Math.max(hEsq, hDir);

  const painelHEsq = hEsq / esquerdo.paineis.length;
  const painelWFrente = wFrente / frente.paineis.length;
  const painelHDir = hDir / direito.paineis.length;

  function segmentoAtivo(id: string) {
    return resultado.abertura.segmentoId === id;
  }

  return (
    <svg
      viewBox={`0 0 ${pad * 2 + espessura * 2 + wFrente} ${pad * 2 + alturaMaxima + espessura + 20}`}
      className="w-full max-w-xl"
      role="img"
      aria-label="Desenho em planta da cortina em U"
    >
      {/* Lado Esquerdo: barra vertical */}
      {esquerdo.paineis.map((p, i) => (
        <g key={p.codigo}>
          <rect
            x={pad + 2}
            y={pad + (alturaMaxima - hEsq) + i * painelHEsq + 2}
            width={espessura - 4}
            height={painelHEsq - 4}
            fill={i % 2 === 0 ? "#F8F5FE" : "#F0E6FF"}
            stroke="#C4B5FD"
          />
          <text
            x={pad + espessura / 2}
            y={pad + (alturaMaxima - hEsq) + i * painelHEsq + painelHEsq / 2 + 3}
            textAnchor="middle"
            fontSize={Math.min(10, painelHEsq / 5)}
            fill="#2B1364"
            fontWeight={600}
            transform={`rotate(-90 ${pad + espessura / 2} ${pad + (alturaMaxima - hEsq) + i * painelHEsq + painelHEsq / 2})`}
          >
            {p.codigo}
          </text>
        </g>
      ))}

      {/* Lado Direito: barra vertical */}
      {direito.paineis.map((p, i) => (
        <g key={p.codigo}>
          <rect
            x={pad + espessura + wFrente + 2}
            y={pad + (alturaMaxima - hDir) + i * painelHDir + 2}
            width={espessura - 4}
            height={painelHDir - 4}
            fill={i % 2 === 0 ? "#F8F5FE" : "#F0E6FF"}
            stroke="#C4B5FD"
          />
          <text
            x={pad + espessura + wFrente + espessura / 2}
            y={pad + (alturaMaxima - hDir) + i * painelHDir + painelHDir / 2 + 3}
            textAnchor="middle"
            fontSize={Math.min(10, painelHDir / 5)}
            fill="#2B1364"
            fontWeight={600}
            transform={`rotate(-90 ${pad + espessura + wFrente + espessura / 2} ${pad + (alturaMaxima - hDir) + i * painelHDir + painelHDir / 2})`}
          >
            {p.codigo}
          </text>
        </g>
      ))}

      {/* Frente: barra horizontal na base */}
      {frente.paineis.map((p, i) => (
        <g key={p.codigo}>
          <rect
            x={pad + espessura + i * painelWFrente + 2}
            y={pad + alturaMaxima + 2}
            width={painelWFrente - 4}
            height={espessura - 4}
            fill={i % 2 === 0 ? "#F8F5FE" : "#F0E6FF"}
            stroke="#C4B5FD"
          />
          <text
            x={pad + espessura + i * painelWFrente + painelWFrente / 2}
            y={pad + alturaMaxima + espessura / 2 + 4}
            textAnchor="middle"
            fontSize={Math.min(10, painelWFrente / 5)}
            fill="#2B1364"
            fontWeight={600}
          >
            {p.codigo}
          </text>
        </g>
      ))}

      {/* Cantos */}
      <rect x={pad} y={pad + alturaMaxima} width={espessura} height={espessura} fill="#9333EA" opacity={0.25} stroke="#9333EA" />
      <rect x={pad + espessura + wFrente} y={pad + alturaMaxima} width={espessura} height={espessura} fill="#9333EA" opacity={0.25} stroke="#9333EA" />

      {/* Cotas */}
      <text x={pad + espessura / 2} y={pad + (alturaMaxima - hEsq) - 6} textAnchor="middle" fontSize={10} fill="#1E1145">
        Esq.: {esquerdo.paineis.length}×{esquerdo.larguraVidroMm}mm
      </text>
      <text x={pad + espessura + wFrente / 2} y={pad + alturaMaxima + espessura + 16} textAnchor="middle" fontSize={10} fill="#1E1145">
        Frente: {frente.paineis.length} × {frente.larguraVidroMm} mm
      </text>
      <text x={pad + espessura + wFrente + espessura / 2} y={pad + (alturaMaxima - hDir) - 6} textAnchor="middle" fontSize={10} fill="#1E1145">
        Dir.: {direito.paineis.length}×{direito.larguraVidroMm}mm
      </text>

      {/* Abertura */}
      {(() => {
        const emEsquerdo = segmentoAtivo("esquerdo");
        const emDireito = segmentoAtivo("direito");
        if (resultado.abertura.lado !== "esquerda" && resultado.abertura.lado !== "direita") {
          return (
            <text x={pad} y={pad + alturaMaxima + espessura + 34} fontSize={10} fill="#9333EA">
              Abertura {resultado.abertura.lado} — definir manualmente
            </text>
          );
        }
        const dir = resultado.abertura.lado === "direita" ? 1 : -1;
        if (emEsquerdo) {
          const idx = resultado.abertura.lado === "direita" ? esquerdo.paineis.length : 0;
          const y = pad + (alturaMaxima - hEsq) + idx * painelHEsq;
          return <line x1={pad + espessura / 2} y1={y} x2={pad + espessura / 2} y2={y + dir * 16} stroke="#9333EA" strokeWidth={2} markerEnd="url(#setaU)" />;
        }
        if (emDireito) {
          const idx = resultado.abertura.lado === "direita" ? direito.paineis.length : 0;
          const y = pad + (alturaMaxima - hDir) + idx * painelHDir;
          const x = pad + espessura + wFrente + espessura / 2;
          return <line x1={x} y1={y} x2={x} y2={y + dir * 16} stroke="#9333EA" strokeWidth={2} markerEnd="url(#setaU)" />;
        }
        const idx = resultado.abertura.lado === "direita" ? frente.paineis.length : 0;
        const x = pad + espessura + idx * painelWFrente;
        const y = pad + alturaMaxima + espessura / 2;
        return <line x1={x} y1={y} x2={x + dir * 16} y2={y} stroke="#9333EA" strokeWidth={2} markerEnd="url(#setaU)" />;
      })()}
      <defs>
        <marker id="setaU" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9333EA" />
        </marker>
      </defs>
    </svg>
  );
}
