import type { Metadata } from "next";
import { EnlaceCard } from "@/components/EnlaceCard";
import { Section } from "@/components/Section";
import { PersonSearch } from "@/components/PersonSearch";
import { plataformas, canalesOficiales } from "@/lib/links";
import { publicPartners } from "@/lib/partners";
import { personSearchOn } from "@/lib/env";

// Plataformas de personas del registro que NO están ya en lib/links.ts (cobertura:
// que aparezcan todas en /personas, no solo en el directorio /aplicaciones).
const YA_LISTADAS = new Set(["desaparecidos_terremoto_ve", "venezuela_te_busca"]);
const masPlataformas = publicPartners()
  .filter((p) => p.area === "personas" && p.homepage && !YA_LISTADAS.has(p.id))
  .map((p) => ({ nombre: p.name, descripcion: p.description, url: p.homepage }));

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

      <div className="mt-4">
        <PersonSearch enabled={personSearchOn} />
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

      {masPlataformas.length > 0 && (
        <Section
          id="mas-plataformas"
          titulo="Más plataformas de búsqueda"
          descripcion="Otros proyectos de la comunidad registrados en el HUB. Algunos manejan datos sensibles: trátalos con cuidado."
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            {masPlataformas.map((p) => (
              <EnlaceCard key={p.nombre} enlace={p} />
            ))}
          </ul>
        </Section>
      )}

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
