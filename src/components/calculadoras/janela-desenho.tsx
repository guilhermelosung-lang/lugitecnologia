import type { ResultadoJanela } from "@/lib/calc/janela";

export function JanelaDesenho({ resultado }: { resultado: ResultadoJanela }) {
  const larguraTotal = resultado.paineis.reduce((acc, p) => acc + p.larguraMm, 0);
  const altura = Math.max(...resultado.paineis.map((p) => p.alturaMm));
  const escala = Math.min(320 / larguraTotal, 220 / altura);
  const w = larguraTotal * escala;
  const h = altura * escala;
  const pad = 24;

  let cursorX = pad;

  return (
    <svg
      viewBox={`0 0 ${w + pad * 2} ${h + pad * 2 + 20}`}
      className="w-full max-w-md"
      role="img"
      aria-label="Desenho técnico da janela"
    >
      <rect x={pad} y={pad} width={w} height={h} fill="none" stroke="#2B1364" strokeWidth={2} />
      {resultado.paineis.map((painel, i) => {
        const painelW = painel.larguraMm * escala;
        const x = cursorX;
        cursorX += painelW;
        return (
          <g key={painel.identificacao}>
            <rect
              x={x + 3}
              y={pad + 3}
              width={painelW - 6}
              height={h - 6}
              fill={i % 2 === 0 ? "#F8F5FE" : "#F0E6FF"}
              stroke="#C4B5FD"
            />
            <text x={x + painelW / 2} y={pad + h / 2} textAnchor="middle" fontSize={13} fill="#2B1364" fontWeight={600}>
              {painel.identificacao}
            </text>
            <text x={x + painelW / 2} y={pad + h / 2 + 16} textAnchor="middle" fontSize={10} fill="#6C6588">
              {painel.tipo === "fixa" ? "fixa" : "móvel"}
            </text>
            {i > 0 && (
              <line x1={x} y1={pad} x2={x} y2={pad + h} stroke="#9333EA" strokeWidth={1} strokeDasharray="3 3" />
            )}
          </g>
        );
      })}
      <text x={pad + w / 2} y={pad + h + 16} textAnchor="middle" fontSize={11} fill="#1E1145">
        {larguraTotal} mm
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
