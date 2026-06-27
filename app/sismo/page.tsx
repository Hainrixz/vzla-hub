import type { Metadata } from "next";
import { ExternalLink, Info } from "lucide-react";
import { Section } from "@/components/Section";
import { AggItemCard } from "@/components/AggItemCard";
import { getItems } from "@/lib/agg/aggregate";

// ISR: revalida la actividad agregada cada 5 min.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Información del sismo — busca-vzla",
  description:
    "Estado y fuentes oficiales sobre el sismo en Venezuela (24-jun-2026). Enlazamos a USGS, GDACS y ReliefWeb; no publicamos cifras propias.",
};

const fuentes: { nombre: string; url: string; dominio: string; nota: string }[] = [
  {
    nombre: "ReliefWeb (OCHA) — página del desastre",
    url: "https://reliefweb.int/disaster/eq-2026-000093-ven",
    dominio: "reliefweb.int",
    nota: "Reportes de situación oficiales y organizaciones respondiendo.",
  },
  {
    nombre: "USGS — Terremotos",
    url: "https://earthquake.usgs.gov/earthquakes/map/",
    dominio: "earthquake.usgs.gov",
    nota: "Magnitud, epicentro, réplicas y mapa de intensidad (ShakeMap).",
  },
  {
    nombre: "GDACS — Alertas globales de desastres",
    url: "https://www.gdacs.org/",
    dominio: "gdacs.org",
    nota: "Nivel de alerta y población potencialmente afectada.",
  },
];

export default async function SismoPage() {
  // Cerca de Venezuela (Caracas), radio amplio para cubrir Caribe / norte de Sudamérica.
  const { items, meta } = await getItems({
    near: { lat: 10.49, lng: -66.88, radiusKm: 2000 },
    limit: 12,
  });
  const actualizado = new Date(meta.fetchedAt).toLocaleString("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Información del sismo
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Un doble sismo afectó el centro-norte de Venezuela (incluida la zona de La
        Guaira y el área de Caracas) la noche del 24 de junio de 2026, seguido de
        réplicas.
      </p>

      <div
        role="note"
        className="mt-4 flex gap-3 rounded-[var(--radius)] border-l-4 border-[var(--color-status-info)] bg-[var(--color-surface)] p-4"
      >
        <Info className="size-5 shrink-0 text-[var(--color-status-info)]" aria-hidden="true" />
        <p className="text-sm text-[var(--color-secondary)]">
          No publicamos cifras de víctimas ni datos propios: varían entre fuentes y
          cambian rápido. Consulta siempre los reportes oficiales actualizados.
        </p>
      </div>

      <Section
        id="actividad"
        titulo="Actividad reciente (agregada)"
        descripcion={`Sismos y alertas de la región (Caribe / norte de Sudamérica) de fuentes oficiales. Actualizado ${actualizado}.`}
      >
        {items.length > 0 ? (
          <ul className="grid gap-3">
            {items.map((it) => (
              <AggItemCard key={it.id} item={it} />
            ))}
          </ul>
        ) : (
          <p className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
            Sin eventos recientes en la región ahora mismo. Consulta las fuentes
            oficiales abajo.
          </p>
        )}
      </Section>

      <Section
        id="fuentes-oficiales"
        titulo="Fuentes oficiales en vivo"
        descripcion="Datos verificados de organismos internacionales."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {fuentes.map((f) => (
            <li
              key={f.nombre}
              className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div>
                <h3 className="font-semibold text-[var(--color-primary)]">{f.nombre}</h3>
                <p className="text-sm text-[var(--color-muted)]">{f.nota}</p>
              </div>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
              >
                Abrir {f.dominio}
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
