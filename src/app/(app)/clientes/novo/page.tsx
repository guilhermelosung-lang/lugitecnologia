import { ClienteForm } from "@/components/clientes/cliente-form";

export default function NovoClientePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Novo cliente</h1>
        <p className="text-sm text-muted">Preencha os dados do cliente.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <ClienteForm />
      </div>
    </div>
  );
}
