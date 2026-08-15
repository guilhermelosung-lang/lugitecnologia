import { FornecedorForm } from "@/components/fornecedores/fornecedor-form";

export default function NovoFornecedorPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Novo fornecedor</h1>
        <p className="text-sm text-muted">Preencha os dados do fornecedor.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <FornecedorForm />
      </div>
    </div>
  );
}
