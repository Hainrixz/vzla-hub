import type { Metadata } from "next";
import Link from "next/link";
import { Plug, ArrowRight } from "lucide-react";
import {
  filterPartners,
  countConnected,
  countWithApi,
  areaMeta,
  type PartnerArea,
} from "@/lib/partners";
import { PartnerCard } from "@/components/PartnerCard";
import { DirectoryFilters } from "@/components/DirectoryFilters";
import { StatusLine } from "@/components/StatusLine";
import { getItems } from "@/lib/agg/aggregate";

export const metadata: Metadata = {
  title: "Aplicaciones conectadas — busca-vzla",
  description:
    "Directorio de las apps y plataformas comunitarias del sismo de Venezuela. Búscalas todas desde un solo lugar y conecta la tuya.",
};

// Orden de presentación de las áreas (life-safety primero).
const AREA_ORDER: PartnerArea[] = [
  "personas",
  "donaciones",
  "recursos",
  "emergencia",
  "voluntariado",
  "informacion",
  "directorio",
  "seguridad",
];

const AREA_KEYS = new Set<string>(AREA_ORDER);

export default async function AplicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; api?: string }>;
}) {
  const { area: areaParam, api } = await searchParams;
  const activeArea =
    areaParam && AREA_KEYS.has(areaParam) ? (areaParam as PartnerArea) : undefined;
  const apiOnly = api === "1";

  // Estado de ingesta en vivo para los partners federados (observabilidad, no SLA).
  const { meta: aggMeta } = await getItems({ limit: 1 });

  const visible = filterPartners({ area: activeArea, apiOnly });
  const inApiScope = filterPartners({ apiOnly }); // para contar por área respetando el toggle de API

  const areaCounts = AREA_ORDER.map((key) => ({
    key,
    count: inApiScope.filter((p) => p.area === key).length,
  })).filter((a) => a.count > 0);

  // Agrupar las visibles por área, en el orden definido.
  const grupos = AREA_ORDER.map((key) => ({
    key,
    items: visible.filter((p) => p.area === key),
  })).filter((g) => g.items.length > 0);

  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Fuentes conectadas
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Estos son los proyectos que alimentan el HUB. Los que exponen datos se
        agregan y se muestran dentro de la app (mira su estado de ingesta); el
        resto se enlaza mientras abren sus puertas.{" "}
        <Link href="/" className="font-medium text-[var(--color-accent)] hover:underline">
          Ver toda la información en el hub
        </Link>
        .
      </p>

      <div className="mt-4">
        <StatusLine connected={countConnected()} withApi={countWithApi()} />
      </div>

      <div className="mt-6">
        <DirectoryFilters
          activeArea={activeArea}
          apiOnly={apiOnly}
          areas={areaCounts}
          total={inApiScope.length}
        />
      </div>

      {grupos.length === 0 ? (
        <p className="mt-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-muted)]">
          No hay proyectos que coincidan con este filtro.{" "}
          <Link href="/aplicaciones" className="font-medium text-[var(--color-accent)] hover:underline">
            Ver todos
          </Link>
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {grupos.map((g) => {
            const meta = areaMeta[g.key];
            const Icon = meta.icon;
            return (
              <section key={g.key} aria-labelledby={`area-${g.key}`}>
                <h2
                  id={`area-${g.key}`}
                  className="mb-4 inline-flex items-center gap-2 text-lg font-bold text-[var(--color-primary)]"
                >
                  <Icon className="size-5 text-[var(--color-muted)]" aria-hidden="true" />
                  {meta.label}
                </h2>
                <ul className="grid gap-4 lg:grid-cols-2">
                  {g.items.map((p) => (
                    <PartnerCard
                      key={p.id}
                      partner={p}
                      ingest={p.sourceId ? aggMeta.sourceStatus[p.sourceId] ?? null : null}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {/* CTA "abre tus puertas" */}
      <div className="mt-12 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-[var(--color-primary)]">
          <Plug className="size-5 text-[var(--color-accent)]" aria-hidden="true" />
          ¿Tienes una app de ayuda?
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Abre tus puertas y conéctala al HUB para que más gente encuentre tu
          información.
        </p>
        <Link
          href="/conectar"
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
        >
          Cómo conectarte
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
