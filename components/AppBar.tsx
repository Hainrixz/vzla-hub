import Link from "next/link";
import { Search, Phone, Plug } from "lucide-react";
import { headerNav } from "@/lib/nav";

/**
 * Barra superior. En móvil: logo + acceso rápido a Emergencias.
 * En lg: además muestra la navegación (el dock inferior se oculta).
 */
export function AppBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 lg:max-w-5xl">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius)] bg-[var(--color-primary)] text-white"
            aria-hidden="true"
          >
            <Search className="size-5" />
          </span>
          <span className="font-display font-bold leading-none text-[var(--color-primary)]">
            busca-vzla
          </span>
        </Link>

        <nav aria-label="Secciones" className="hidden lg:flex lg:items-center lg:gap-1">
          {headerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Invitación "abre tus puertas" — discreta, no compite con el 911. */}
          <Link
            href="/conectar"
            className="hidden sm:inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius)] border border-[var(--color-border-strong)] px-3 py-1.5 text-sm font-semibold text-[var(--color-secondary)] transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
          >
            <Plug className="size-4" aria-hidden="true" />
            Conectar
          </Link>
          <a
            href="tel:911"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius)] bg-[var(--color-danger)] px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-danger-hover)] cursor-pointer"
          >
            <Phone className="size-4" aria-hidden="true" />
            Emergencia 911
          </a>
        </div>
      </div>
    </header>
  );
}
