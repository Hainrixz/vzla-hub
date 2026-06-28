import Link from "next/link";
import { Users, Phone, ShieldAlert, ArrowRight, Plug, SearchX } from "lucide-react";
import { InfoAccordion } from "@/components/InfoAccordion";
import { Section } from "@/components/Section";
import { ShareButton } from "@/components/ShareButton";
import { StatusLine } from "@/components/StatusLine";
import { HubSearch } from "@/components/HubSearch";
import { AggItemCard } from "@/components/AggItemCard";
import { getItems, type ItemFilter } from "@/lib/agg/aggregate";
import type { ItemType } from "@/lib/agg/types";
import { countConnected, countWithApi } from "@/lib/partners";

// El HUB en vivo: revalida el feed agregado cada 5 min.
export const revalidate = 300;

const SITE_URL = "https://busca-vzla.org";
const SHARE_TEXT =
  "Toda la ayuda del sismo en Venezuela en un solo lugar: buscar personas, recursos, refugios y donaciones.";

// Vista "Ayuda" por defecto (lo que la gente necesita), las alertas viven aparte.
const AYUDA: ItemType[] = ["resource", "donation_appeal", "zone_signal"];
const SINGLE = new Set<ItemType>(["resource", "donation_appeal", "zone_signal", "official_alert"]);

function buildFilter(activeType: string | undefined, q?: string): ItemFilter {
  const base: ItemFilter = q ? { q } : {};
  if (!activeType) return { ...base, types: AYUDA };
  if (activeType === "all") return base;
  if (SINGLE.has(activeType as ItemType)) return { ...base, type: activeType as ItemType };
  return { ...base, types: AYUDA };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" && sp.q.trim() ? sp.q.trim().slice(0, 80) : undefined;
  const activeType =
    sp.type === "all" || (sp.type && SINGLE.has(sp.type as ItemType)) ? sp.type : undefined;

  const { items, meta } = await getItems({ ...buildFilter(activeType, q), limit: 24 });
  const actualizado = new Date(meta.fetchedAt).toLocaleString("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main id="contenido" className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10">
      {/* Hero */}
      <section className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
          <ShieldAlert className="size-3.5 text-[var(--color-status-desaparecido)]" aria-hidden="true" />
          Pueden ocurrir réplicas — mantente alerta
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-[var(--color-primary)] sm:text-3xl">
          Toda la información del sismo, en un solo lugar
        </h1>
        <p className="mt-2 text-[var(--color-secondary)]">
          Busca y encuentra aquí mismo: recursos, refugios, donaciones, alertas y las
          necesidades por zona. Reunimos lo que reportan las plataformas de la comunidad.
        </p>
      </section>

      {/* Buscador unificado del HUB */}
      <HubSearch q={q} activeType={activeType} />

      {/* Feed agregado en vivo */}
      <section aria-labelledby="feed-titulo" className="mt-6 mb-10">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 id="feed-titulo" className="text-lg font-bold text-[var(--color-primary)]">
            {q ? `Resultados para "${q}"` : "En el HUB ahora"}
          </h2>
          <p className="font-mono text-xs text-[var(--color-muted)]">
            {meta.total} resultado{meta.total === 1 ? "" : "s"} · {actualizado}
          </p>
        </div>

        {items.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((it) => (
              <AggItemCard key={it.id} item={it} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
            <SearchX className="size-7 text-[var(--color-muted)]" aria-hidden="true" />
            <p className="text-sm text-[var(--color-muted)]">
              {q
                ? "Sin coincidencias por ahora. Prueba otra palabra o cambia el filtro."
                : "Aún no hay contenido agregado en esta categoría."}
            </p>
            {q && (
              <Link href="/" className="text-sm font-semibold text-[var(--color-accent)] hover:underline">
                Ver todo el HUB
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Buscar a una persona (plano separado, dentro de la app) */}
      <Link
        href="/personas"
        className="mb-8 flex items-center gap-4 rounded-[var(--radius)] border border-[var(--color-accent)] bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
      >
        <span
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--color-accent)] text-white"
          aria-hidden="true"
        >
          <Users className="size-6" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-[var(--color-primary)]">
            ¿Buscas a una persona?
          </span>
          <span className="block text-sm text-[var(--color-muted)]">
            Busca en todas las plataformas de desaparecidos desde aquí
          </span>
        </span>
        <ArrowRight className="size-5 text-[var(--color-accent)]" aria-hidden="true" />
      </Link>

      {/* Emergencias */}
      <Section id="emergencias" titulo="Emergencias" descripcion="Si hay vidas en riesgo ahora, llama de inmediato.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="tel:911"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-danger)] px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-danger-hover)] cursor-pointer"
          >
            <Phone className="size-5" aria-hidden="true" />
            Llamar al 911
          </a>
          <a
            href="tel:171"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--color-danger)] px-4 py-2 font-semibold text-[var(--color-danger)] transition-colors duration-200 hover:bg-[var(--color-danger-bg)] cursor-pointer"
          >
            <Phone className="size-5" aria-hidden="true" />
            Llamar al 171
          </a>
        </div>
        <Link
          href="/recursos"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
        >
          Ver guías de seguridad y más números
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      {/* Anti-estafa */}
      <Section id="cuidado" titulo="Cuídate de las estafas">
        <InfoAccordion titulo="Cómo reconocer un fraude tras el sismo" defaultOpen>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>Nadie legítimo te dirá “tengo a tu familiar, paga para liberarlo”.</li>
            <li>
              Desconfía de quien pide dinero por transferencia, gift card o cripto. Esos pagos
              no se pueden recuperar.
            </li>
            <li>
              Verifica cualquier cuenta o número <strong>solo</strong> en el sitio oficial de la
              organización, no en mensajes reenviados.
            </li>
            <li>
              busca-vzla nunca te pedirá datos de pago ni recauda dinero: solo enlazamos a
              organizaciones reconocidas.
            </li>
          </ul>
        </InfoAccordion>
      </Section>

      {/* Fuentes que alimentan el hub */}
      <Section id="fuentes" titulo="Lo que alimenta este HUB">
        <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <StatusLine connected={countConnected()} withApi={countWithApi()} />
          <p className="text-sm text-[var(--color-muted)]">
            Este hub se nutre de las plataformas y apps de la comunidad. Mientras más se
            conecten, más información encuentras aquí.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/aplicaciones" className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-accent)] hover:underline cursor-pointer">
              Ver las fuentes conectadas
            </Link>
            <Link href="/conectar" className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-secondary)] hover:underline cursor-pointer">
              <Plug className="size-4" aria-hidden="true" />
              ¿Tienes una app? Abre tus puertas
            </Link>
            <ShareButton url={SITE_URL} texto={SHARE_TEXT} />
          </div>
        </div>
      </Section>
    </main>
  );
}
