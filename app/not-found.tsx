import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="contenido"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center lg:max-w-5xl"
    >
      <p className="font-mono text-sm text-[var(--color-muted)]">Error 404</p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Esta página no existe
      </h1>
      <p className="mt-3 max-w-md text-[var(--color-secondary)]">
        El enlace puede estar roto o la página se movió. Vuelve al inicio o busca a
        una persona desde el HUB.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
        >
          <Home className="size-5" aria-hidden="true" />
          Ir al inicio
        </Link>
        <Link
          href="/personas"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] border border-[var(--color-border-strong)] px-5 py-2.5 font-semibold text-[var(--color-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] cursor-pointer"
        >
          <Search className="size-5" aria-hidden="true" />
          Buscar a alguien
        </Link>
      </div>
    </main>
  );
}
