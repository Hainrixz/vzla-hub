import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Chips de filtro del hub. `key` undefined = vista "Ayuda" por defecto. */
export const HUB_CHIPS: { key?: string; label: string }[] = [
  { key: undefined, label: "Ayuda" },
  { key: "resource", label: "Recursos" },
  { key: "donation_appeal", label: "Donaciones" },
  { key: "zone_signal", label: "Zonas" },
  { key: "official_alert", label: "Alertas" },
  { key: "all", label: "Todo" },
];

function hrefFor(key: string | undefined, q?: string): string {
  const sp = new URLSearchParams();
  if (key) sp.set("type", key);
  if (q) sp.set("q", q);
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

/**
 * Buscador unificado del HUB: un <form> GET (funciona sin JS) que busca dentro de
 * la app, más chips de tipo que filtran el feed agregado. Todo se ve aquí mismo.
 */
export function HubSearch({ q, activeType }: { q?: string; activeType?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <form action="/" method="get" role="search" className="flex gap-2">
        {activeType && <input type="hidden" name="type" value={activeType} />}
        <label htmlFor="hub-q" className="sr-only">
          Buscar en el HUB
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden="true"
          />
          <input
            id="hub-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Busca recursos, refugios, donaciones, alertas…"
            className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-3 text-base text-[var(--color-foreground)] outline-none focus-visible:border-[var(--color-accent)]"
          />
        </div>
        <button
          type="submit"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-5 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
        >
          Buscar
        </button>
      </form>

      <nav aria-label="Filtrar el HUB" className="flex flex-wrap gap-2">
        {HUB_CHIPS.map((c) => {
          const active = c.key === activeType;
          return (
            <Link
              key={c.label}
              href={hrefFor(c.key, q)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "inline-flex min-h-[44px] items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)] hover:border-[var(--color-border-strong)]"
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
