"use client";

import Link from "next/link";
import { RotateCw, Home } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      id="contenido"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center lg:max-w-5xl"
    >
      <p className="font-mono text-sm text-[var(--color-muted)]">Algo salió mal</p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        No pudimos cargar esta página
      </h1>
      <p className="mt-3 max-w-md text-[var(--color-secondary)]">
        Ocurrió un error temporal. Reintenta; si persiste, vuelve al inicio. En una
        emergencia, llama al 911.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
        >
          <RotateCw className="size-5" aria-hidden="true" />
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] border border-[var(--color-border-strong)] px-5 py-2.5 font-semibold text-[var(--color-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] cursor-pointer"
        >
          <Home className="size-5" aria-hidden="true" />
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
