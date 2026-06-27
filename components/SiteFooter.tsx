import Link from "next/link";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6 text-sm text-[var(--color-muted)] lg:max-w-5xl">
        <p className="inline-flex items-center gap-2">
          <Heart className="size-4 text-[var(--color-accent)]" aria-hidden="true" />
          Herramienta comunitaria. No es un canal oficial y no reemplaza a
          Protección Civil, CICPC ni a la Cruz Roja.
        </p>
        <p>
          busca-vzla nunca recauda dinero ni pide datos de pago. Trata con cuidado
          y respeto la información de las personas afectadas.
        </p>
        <nav aria-label="Enlaces legales" className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/fuentes" className="underline hover:text-[var(--color-primary)] cursor-pointer">
            Fuentes y verificación
          </Link>
          <Link href="/legal" className="underline hover:text-[var(--color-primary)] cursor-pointer">
            Aviso legal
          </Link>
          <Link href="/personas" className="underline hover:text-[var(--color-primary)] cursor-pointer">
            Otras plataformas
          </Link>
        </nav>
      </div>
    </footer>
  );
}
