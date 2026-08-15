import { SistemaForm } from "@/components/catalogo/sistema-form";

export default function NovoSistemaPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Novo sistema</h1>
        <p className="text-sm text-muted">Cadastre um sistema (box, sacada, porta etc.) do seu catálogo.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <SistemaForm />
      </div>
    </div>
  );
}
