import type { ResultadoBoxFrontalCorrer } from "@/lib/calc/box";

export function BoxDesenho({ resultado }: { resultado: ResultadoBoxFrontalCorrer }) {
  const largura = resultado.larguraAdotadaMm;
  const altura = resultado.alturaAdotadaMm;
  const escala = 320 / largura;
  const w = largura * escala;
  const h = altura * escala;
  const pad = 24;

  const [v1, v2] = resultado.vidros;
  const larguraFolhaPx = (v1.larguraMm / largura) * w;

  return (
    <svg
      viewBox={`0 0 ${w + pad * 2} ${h + pad * 2 + 30}`}
      className="w-full max-w-md"
      role="img"
      aria-label="Desenho técnico do box"
    >
      <rect x={pad} y={pad} width={w} height={h} fill="none" stroke="#2B1364" strokeWidth={2} />
      <line
        x1={pad + larguraFolhaPx}
        y1={pad}
        x2={pad + larguraFolhaPx}
        y2={pad + h}
        stroke="#9333EA"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <rect x={pad + 4} y={pad + 4} width={larguraFolhaPx - 8} height={h - 8} fill="#F8F5FE" stroke="#C4B5FD" />
      <rect x={pad + larguraFolhaPx + 4} y={pad + 4} width={w - larguraFolhaPx - 8} height={h - 8} fill="#F0E6FF" stroke="#C4B5FD" />
      <text x={pad + larguraFolhaPx / 2} y={pad + h / 2} textAnchor="middle" fontSize={13} fill="#2B1364" fontWeight={600}>
        {v1.identificacao}
      </text>
      <text x={pad + larguraFolhaPx / 2} y={pad + h / 2 + 16} textAnchor="middle" fontSize={10} fill="#6C6588">
        {v1.tipo === "fixa" ? "fixa" : "móvel"}
      </text>
      <text x={pad + larguraFolhaPx + (w - larguraFolhaPx) / 2} y={pad + h / 2} textAnchor="middle" fontSize={13} fill="#2B1364" fontWeight={600}>
        {v2.identificacao}
      </text>
      <text x={pad + larguraFolhaPx + (w - larguraFolhaPx) / 2} y={pad + h / 2 + 16} textAnchor="middle" fontSize={10} fill="#6C6588">
        {v2.tipo === "fixa" ? "fixa" : "móvel"}
      </text>
      {v2.tipo === "movel" && (
        <path
          d={`M ${pad + larguraFolhaPx + 12} ${pad + h / 2 - 24} l 14 0 l -5 -5 M ${pad + larguraFolhaPx + 26} ${pad + h / 2 - 24} l -5 5`}
          stroke="#9333EA"
          strokeWidth={1.5}
          fill="none"
        />
      )}
      {v1.tipo === "movel" && (
        <path
          d={`M ${pad + larguraFolhaPx - 12} ${pad + h / 2 - 24} l -14 0 l 5 -5 M ${pad + larguraFolhaPx - 26} ${pad + h / 2 - 24} l 5 5`}
          stroke="#9333EA"
          strokeWidth={1.5}
          fill="none"
        />
      )}
      <text x={pad + w / 2} y={pad + h + 18} textAnchor="middle" fontSize={11} fill="#1E1145">
        {largura} mm
      </text>
      <text x={pad - 8} y={pad + h / 2} textAnchor="middle" fontSize={11} fill="#1E1145" transform={`rotate(-90 ${pad - 8} ${pad + h / 2})`}>
        {altura} mm
      </text>
    </svg>
  );
}
