import type { ResultadoPorta } from "@/lib/calc/porta";

export function PortaDesenho({
  resultado,
  ladoDobradica,
}: {
  resultado: ResultadoPorta;
  ladoDobradica: "esquerda" | "direita";
}) {
  const larguraTotal = resultado.paineis.reduce((acc, p) => acc + p.larguraMm, 0);
  const altura = Math.max(...resultado.paineis.map((p) => p.alturaMm));
  const escala = Math.min(320 / larguraTotal, 320 / altura);
  const w = larguraTotal * escala;
  const h = altura * escala;
  const pad = 24;

  const temPivosOuDobradicas = resultado.furos.some((f) => f.descricao.includes("obradiça") || f.descricao.includes("ivô"));
  const painelPrincipal = resultado.paineis.find((p) => p.descricao !== "Fixo lateral") ?? resultado.paineis[0];
  const larguraPrincipalPx = painelPrincipal.larguraMm * escala;
  const ladoDobradicaX = ladoDobradica === "esquerda" ? pad : pad + larguraPrincipalPx;
  const ladoPuxadorX = ladoDobradica === "esquerda" ? pad + larguraPrincipalPx : pad;

  let cursorX = pad;

  return (
    <svg
      viewBox={`0 0 ${w + pad * 2} ${h + pad * 2 + 20}`}
      className="w-full max-w-sm"
      role="img"
      aria-label="Desenho técnico da porta"
    >
      {resultado.paineis.map((painel, i) => {
        const painelW = painel.larguraMm * escala;
        const rect = (
          <rect
            key={i}
            x={cursorX}
            y={pad}
            width={painelW}
            height={h}
            fill={painel.descricao === "Fixo lateral" ? "#F0E6FF" : "#F8F5FE"}
            stroke="#2B1364"
            strokeWidth={2}
          />
        );
        cursorX += painelW;
        return rect;
      })}

      {temPivosOuDobradicas &&
        resultado.furos
          .filter((f) => f.descricao.includes("obradiça") || f.descricao.includes("ivô"))
          .map((f, i) => (
            <circle key={i} cx={ladoDobradicaX} cy={pad + (f.distanciaBordaSuperiorMm / altura) * h} r={4} fill="#9333EA" />
          ))}

      {(() => {
        const furoPuxador = resultado.furos.find((f) => f.descricao.includes("Fechadura"));
        return furoPuxador ? (
          <circle cx={ladoPuxadorX} cy={pad + (furoPuxador.distanciaBordaSuperiorMm / altura) * h} r={5} fill="#D946EF" />
        ) : null;
      })()}

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
