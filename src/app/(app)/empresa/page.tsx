import { requireUsuario } from "@/lib/auth/context";
import { EmpresaForm } from "@/components/empresa/empresa-form";

export default async function EmpresaPage() {
  const context = await requireUsuario();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Empresa</h1>
        <p className="text-sm text-muted">
          Dados e configurações comerciais usados em todo o sistema.
        </p>
      </div>
      <EmpresaForm empresa={context.empresa} />
    </div>
  );
}
