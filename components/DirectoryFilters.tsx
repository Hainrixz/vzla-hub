import Link from "next/link";
import { cn } from "@/lib/utils";
import { areaMeta, type PartnerArea } from "@/lib/partners";

type AreaCount = { key: PartnerArea; count: number };

/** Construye el href preservando el otro filtro (área / solo-API). */
function hrefFor(area: PartnerArea | undefined, apiOnly: boolean): string {
  const sp = new URLSearchParams();
  if (area) sp.set("area", area);
  if (apiOnly) sp.set("api", "1");
  const qs = sp.toString();
  return qs ? `/aplicaciones?${qs}` : "/aplicaciones";
}

function chipClass(active: boolean): string {
  return cn(
    "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
    active
      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)] hover:border-[var(--color-border-strong)]"
  );
}

/**
 * Filtros del directorio sin JS de cliente: cada chip es un <Link> que togglea
 * query params; el filtrado ocurre en el Server Component de la página.
 */
export function DirectoryFilters({
  activeArea,
  apiOnly,
  areas,
  total,
}: {
  activeArea?: PartnerArea;
  apiOnly: boolean;
  areas: AreaCount[];
  total: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <nav aria-label="Filtrar por área" className="flex flex-wrap gap-2">
        <Link
          href={hrefFor(undefined, apiOnly)}
          aria-current={!activeArea ? "true" : undefined}
          className={chipClass(!activeArea)}
        >
          Todas <span className="font-mono text-xs">{total}</span>
        </Link>
        {areas.map(({ key, count }) => {
          const active = activeArea === key;
          const Icon = areaMeta[key].icon;
          return (
            <Link
              key={key}
              href={hrefFor(key, apiOnly)}
              aria-current={active ? "true" : undefined}
              className={chipClass(active)}
            >
              <Icon className="size-4" aria-hidden="true" />
              {areaMeta[key].label}{" "}
              <span className="font-mono text-xs">{count}</span>
            </Link>
          );
        })}
      </nav>
      <div>
        <Link
          href={hrefFor(activeArea, !apiOnly)}
          aria-current={apiOnly ? "true" : undefined}
          className={chipClass(apiOnly)}
        >
          Con API
        </Link>
      </div>
    </div>
  );
}
