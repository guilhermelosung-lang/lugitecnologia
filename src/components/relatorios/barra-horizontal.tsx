export function BarraHorizontal({ dados }: { dados: { label: string; valor: number; destaque?: string }[] }) {
  const max = Math.max(1, ...dados.map((d) => d.valor));
  return (
    <div className="space-y-2">
      {dados.map((d) => (
        <div key={d.label} className="flex items-center gap-3 text-sm">
          <span className="w-20 shrink-0 text-muted">{d.label}</span>
          <div className="h-5 flex-1 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
              style={{ width: `${Math.max(2, (d.valor / max) * 100)}%` }}
            />
          </div>
          <span className="w-28 shrink-0 text-right font-medium text-foreground">{d.destaque ?? d.valor}</span>
        </div>
      ))}
    </div>
  );
}
