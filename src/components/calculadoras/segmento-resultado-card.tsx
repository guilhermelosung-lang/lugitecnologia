import type { ResultadoSegmento } from "@/lib/calc/sacada-segmento";
import { SegmentoElevacao } from "@/components/calculadoras/segmento-elevacao";

const CORES_STATUS: Record<ResultadoSegmento["conferencia"]["status"], string> = {
  verde: "bg-success/10 text-success border-success/30",
  amarelo: "bg-warning/10 text-warning border-warning/30",
  vermelho: "bg-danger/10 text-danger border-danger/30",
};

export function SegmentoResultadoCard({ segmento }: { segmento: ResultadoSegmento }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold text-primary">{segmento.rotulo}</h3>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${CORES_STATUS[segmento.conferencia.status]}`}>
          {segmento.conferencia.mensagem} (Δ {segmento.conferencia.diferencaMm} mm)
        </span>
      </div>

      <SegmentoElevacao segmento={segmento} />

      {segmento.alertaAltura && (
        <p className="mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-foreground">
          ⚠️ {segmento.alertaAltura}
        </p>
      )}

      <div className="mt-4 grid gap-3 text-xs text-muted sm:grid-cols-2">
        <p>
          Vão informado: <strong className="text-foreground">{segmento.larguraInformadaMm} mm</strong> · desconto de
          ponta: <strong className="text-foreground">{segmento.descontoInicialMm + segmento.descontoFinalMm} mm</strong> ·
          largura útil: <strong className="text-foreground">{segmento.larguraUtilMm} mm</strong>
        </p>
        <p>
          Alturas: {segmento.alturaEsquerdaMm} / {segmento.alturaCentralMm} / {segmento.alturaDireitaMm} mm · adotada
          (
          {segmento.criterioAltura === "media" ? "média" : "menor"}
          ): <strong className="text-foreground">{segmento.alturaAdotadaMm} mm</strong>
        </p>
      </div>

      <table className="mt-4 w-full text-sm">
        <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="py-2">Peça</th>
            <th className="py-2">Largura</th>
            <th className="py-2">Altura</th>
            <th className="py-2">Leito</th>
            <th className="py-2">Usinagem</th>
            <th className="py-2">Peso</th>
          </tr>
        </thead>
        <tbody>
          {segmento.paineis.map((p) => (
            <tr key={p.codigo} className="border-b border-border last:border-0">
              <td className="py-2 font-medium text-foreground">{p.codigo}</td>
              <td className="py-2 text-muted">{p.larguraMm} mm</td>
              <td className="py-2 text-muted">{p.alturaMm} mm</td>
              <td className="py-2 text-muted">{p.comprimentoLeitoMm} mm</td>
              <td className="py-2 text-muted">
                {p.usinagem ? `${p.usinagem.posicaoMm} mm (${p.usinagem.lado})` : "—"}
              </td>
              <td className="py-2 text-muted">{p.pesoKg} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-foreground">
        Peso do segmento: <strong>{segmento.pesoTotalKg} kg</strong> · Peça mais pesada:{" "}
        <strong>{segmento.pesoMaiorPecaKg} kg</strong>
      </p>
    </div>
  );
}
