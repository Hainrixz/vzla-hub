import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Mapa — busca-vzla",
  description:
    "Mapa de zonas afectadas por el sismo en Venezuela. En construcción: por ahora consulta personas y recursos por texto.",
};

export default function MapaPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Mapa de zonas afectadas
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Estamos preparando un mapa ligero (pensado para señal débil) con las zonas
        afectadas y, más adelante, la capa de personas reportadas. Mientras tanto,
        puedes acceder a todo por texto, sin gastar datos.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <span
          className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-background)] text-[var(--color-accent)]"
          aria-hidden="true"
        >
          <MapPin className="size-6" />
        </span>
        <p className="font-semibold text-[var(--color-primary)]">Mapa en construcción</p>
        <p className="max-w-sm text-sm text-[var(--color-muted)]">
          El mapa mostrará zonas, no ubicaciones exactas de personas, para proteger
          la privacidad de las víctimas.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/personas"
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-4 py-2 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
        >
          Buscar personas
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/recursos"
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--color-border)] px-4 py-2 font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
        >
          Ver recursos
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
