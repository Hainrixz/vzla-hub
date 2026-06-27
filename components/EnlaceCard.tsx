import { ExternalLink, Phone, Info } from "lucide-react";
import type { Enlace } from "@/lib/links";

/** Tarjeta de una plataforma o canal del HUB de enlace cruzado. */
export function EnlaceCard({ enlace }: { enlace: Enlace }) {
  return (
    <li className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-[var(--color-primary)]">
          {enlace.nombre}
        </h3>
        {enlace.reportes && (
          <span className="self-start text-xs font-medium rounded-full bg-[var(--color-background)] border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-muted)]">
            {enlace.reportes}
          </span>
        )}
        <p className="text-sm text-[var(--color-muted)]">{enlace.descripcion}</p>
      </div>

      <div className="mt-auto">
        {enlace.url ? (
          <a
            href={enlace.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
          >
            Abrir plataforma
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        ) : enlace.telefono ? (
          <a
            href={`tel:${enlace.telefono}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius)] border border-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)] transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)] cursor-pointer"
          >
            <Phone className="size-4" aria-hidden="true" />
            Llamar al {enlace.telefono}
          </a>
        ) : (
          <p className="inline-flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <Info className="size-4 shrink-0" aria-hidden="true" />
            Confirma el canal oficial antes de compartirlo.
          </p>
        )}
      </div>
    </li>
  );
}
