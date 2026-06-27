import type { Metadata } from "next";
import { Construction } from "lucide-react";
import { EnlaceCard } from "@/components/EnlaceCard";
import { Section } from "@/components/Section";
import { plataformas, canalesOficiales } from "@/lib/links";

export const metadata: Metadata = {
  title: "Buscar personas — busca-vzla",
  description:
    "Busca y reporta personas desaparecidas tras el sismo en Venezuela. Reunimos las plataformas ciudadanas y los canales oficiales para que busques en todas desde un solo lugar.",
};

export default function PersonasPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Buscar a una persona
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Hay varias plataformas activas. Para no fragmentar la búsqueda, aquí las
        reunimos: busca en todas y, si reportas, hazlo donde más probable sea que
        te encuentren.
      </p>

      <div className="mt-4 flex items-start gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <Construction
          className="size-5 shrink-0 mt-0.5 text-[var(--color-status-desaparecido)]"
          aria-hidden="true"
        />
        <p className="text-sm text-[var(--color-muted)]">
          El reporte propio con mapa y fotos está en construcción y se activará
          cuando esté listo de forma segura (sin exponer datos personales). Por
          ahora, estas plataformas ya te permiten buscar y reportar.
        </p>
      </div>

      <Section
        id="plataformas"
        titulo="Busca también en estas plataformas"
        descripcion="Plataformas ciudadanas. No son operadas por busca-vzla."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {plataformas.map((p) => (
            <EnlaceCard key={p.nombre} enlace={p} />
          ))}
        </ul>
      </Section>

      <Section
        id="oficiales"
        titulo="Canales oficiales"
        descripcion="Para denuncias formales y reunificación familiar."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {canalesOficiales.map((c) => (
            <EnlaceCard key={c.nombre} enlace={c} />
          ))}
        </ul>
      </Section>
    </main>
  );
}
