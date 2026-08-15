import Image from "next/image";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function Topbar({
  nome,
  perfilNome,
}: {
  nome: string;
  perfilNome: string;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden font-heading text-sm font-semibold text-primary">
        <Image src="/logo-icon.png" alt="Lugi" width={24} height={24} className="h-6 w-6 object-contain" />
        Lugi Sistemas
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{nome}</p>
          <p className="text-xs capitalize text-muted">{perfilNome}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-sm font-semibold text-white">
          {nome.charAt(0).toUpperCase()}
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" className="px-2.5 py-1.5 text-xs">
            Sair
          </Button>
        </form>
      </div>
    </header>
  );
}
