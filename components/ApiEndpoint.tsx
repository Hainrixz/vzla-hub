import { ChevronDown } from "lucide-react";

/**
 * Documentación de un endpoint, en un <details> nativo (offline, sin JS).
 * El summary muestra el método (mono) + la ruta.
 */
export function ApiEndpoint({
  method,
  path,
  descripcion,
  children,
}: {
  method: string;
  path: string;
  descripcion: string;
  children?: React.ReactNode;
}) {
  return (
    <details className="group rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] [&_summary::-webkit-details-marker]:hidden">
      <summary
        aria-label={`${method} ${path}`}
        className="flex min-h-[48px] cursor-pointer list-none items-center gap-3 px-4 py-3"
      >
        <span className="rounded bg-[var(--color-surface-2)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--color-accent)]">
          {method}
        </span>
        <code className="flex-1 font-mono text-sm text-[var(--color-primary)]">{path}</code>
        <ChevronDown
          className="size-5 shrink-0 text-[var(--color-muted)] transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="flex flex-col gap-3 px-4 pb-4 text-sm text-[var(--color-secondary)]">
        <p>{descripcion}</p>
        {children}
      </div>
    </details>
  );
}
