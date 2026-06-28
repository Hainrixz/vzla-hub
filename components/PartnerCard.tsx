import { ExternalLink, BadgeCheck, Lock, Info, Plug, Activity } from "lucide-react";
import { areaMeta, type Partner } from "@/lib/partners";
import { PartnerStatusBadge } from "@/components/PartnerStatusBadge";

export type IngestHealth = { ok: boolean; count: number } | null;

/** Estado de ingesta en vivo de un partner federado (observabilidad, no SLA). */
function ingestMeta(h: IngestHealth): { label: string; token: string } | null {
  if (!h) return null;
  if (!h.ok) return { label: "Fuente caída", token: "--color-danger" };
  if (h.count === 0) return { label: "Sin datos recientes", token: "--color-prototype" };
  return { label: `Ingesta OK · ${h.count}`, token: "--color-live" };
}

/** Fecha ISO → "27 jun 2026" en español. */
function fechaCorta(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Tarjeta de un proyecto del directorio. Sobria, hairline, estilo status-page. */
export function PartnerCard({ partner, ingest }: { partner: Partner; ingest?: IngestHealth }) {
  const area = areaMeta[partner.area];
  const AreaIcon = area.icon;
  const health = partner.federated ? ingestMeta(ingest ?? null) : null;
  return (
    <li className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-[var(--color-primary)]">
          {partner.name}
        </h3>
        <PartnerStatusBadge status={partner.status} />
      </div>

      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)]">
        <AreaIcon className="size-4 shrink-0" aria-hidden="true" />
        {area.label}
      </p>

      <p className="line-clamp-2 text-sm text-[var(--color-muted)]">
        {partner.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {partner.hasApi && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 font-mono font-medium text-[var(--color-secondary)]">
            <Plug className="size-3.5" aria-hidden="true" />
            API
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-[var(--color-muted)]">
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          Verificado {fechaCorta(partner.lastVerified)}
        </span>
        {partner.handlesPII && (
          <span className="inline-flex items-center gap-1 text-[var(--color-muted)]">
            <Lock className="size-3.5" aria-hidden="true" />
            Datos personales
          </span>
        )}
        {health && (
          <span className="inline-flex items-center gap-1 text-[var(--color-muted)]">
            <Activity className="size-3.5" style={{ color: `var(${health.token})` }} aria-hidden="true" />
            {health.label}
          </span>
        )}
      </div>

      <div className="mt-auto pt-1">
        {partner.homepage ? (
          <a
            href={partner.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            Abrir
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        ) : (
          <p className="inline-flex min-h-[44px] items-center gap-2 text-xs text-[var(--color-muted)]">
            <Info className="size-4 shrink-0" aria-hidden="true" />
            Solo referencia (sin enlace verificado)
          </p>
        )}
      </div>
    </li>
  );
}
