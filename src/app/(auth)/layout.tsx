import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 55% at 88% 10%, rgba(217,70,239,.3), transparent 60%), radial-gradient(50% 50% at 8% 95%, rgba(147,51,234,.35), transparent 60%), linear-gradient(160deg, #2b1364 0%, #170936 100%)",
        }}
      />
      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2 font-heading text-lg font-semibold text-white"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95">
          <Image src="/logo-icon.png" alt="Lugi" width={36} height={36} className="h-7 w-7 object-contain" />
        </span>
        Lugi Sistemas
      </Link>
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">{children}</div>
    </div>
  );
}
