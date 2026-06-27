import { ExternalLink, BadgeCheck, Clock } from "lucide-react";
import type { AggItem } from "@/lib/agg/types";

function relativo(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMin = Math.round((then - Date.now()) / 60000);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const abs = Math.abs(diffMin);
  if (abs < 60) return rtf.format(diffMin, "minute");
  if (abs < 1440) return rtf.format(Math.round(diffMin / 60), "hour");
  return rtf.format(Math.round(diffMin / 1440), "day");
}

/** Tarjeta de un item agregado: siempre con fuente, fecha y enlace de origen. */
export function AggItemCard({ item }: { item: AggItem }) {
  const mag = item.extra?.magnitude;
  const alert = item.extra?.alertLevel;
  return (
    <li className="flex flex-col gap-2 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-background)] px-2 py-0.5 font-medium text-[var(--color-secondary)]">
          <BadgeCheck className="size-3.5 text-[var(--color-status-vivo)]" aria-hidden="true" />
          {item.provenance.sourceName}
        </span>
        {item.trustTier === 1 && (
          <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-muted)]">
            Oficial
          </span>
        )}
        {typeof mag === "number" && (
          <span className="rounded-full bg-[var(--color-danger-bg)] px-2 py-0.5 font-semibold text-[var(--color-danger)]">
            M{mag}
          </span>
        )}
        {alert && (
          <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-muted)] capitalize">
            {String(alert)}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-[var(--color-muted)]">
          <Clock className="size-3.5" aria-hidden="true" />
          {relativo(item.publishedAt)}
        </span>
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-start gap-1.5 font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:underline cursor-pointer"
      >
        {item.title}
        <ExternalLink className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
      </a>
      {item.summary && (
        <p className="text-sm text-[var(--color-muted)]">{item.summary}</p>
      )}
      <p className="text-xs text-[var(--color-muted)]">
        Atribuido a {item.provenance.sourceName} · {item.provenance.license}
      </p>
    </li>
  );
}
