import { ExternalLink, BadgeCheck, Info } from "lucide-react";
import type { Donacion } from "@/lib/donations";

/** Tarjeta de donación — SOLO enlace al dominio oficial de la organización. */
export function DonationCard({
  d,
  verificadoTexto,
}: {
  d: Donacion;
  verificadoTexto: string;
}) {
  return (
    <li className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-[var(--color-primary)]">{d.nombre}</h3>
        <p className="text-sm text-[var(--color-muted)]">{d.rol}</p>
        {d.nota && (
          <p className="mt-1 inline-flex items-start gap-1.5 text-xs text-[var(--color-secondary)]">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {d.nota}
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <a
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-4 py-2 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
        >
          Donar en {d.dominio}
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">(sitio oficial, abre en pestaña nueva)</span>
        </a>
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
          <BadgeCheck className="size-3.5 text-[var(--color-status-vivo)]" aria-hidden="true" />
          Sitio oficial · {verificadoTexto}
        </span>
      </div>
    </li>
  );
}
