/**
 * Línea de estado tipo status-page ("● N proyectos conectados · M con API").
 * El punto de color va SIEMPRE acompañado de texto (color nunca es el único
 * indicador). Reutilizable en la home, el directorio y la página de conexión.
 */
export function StatusLine({
  connected,
  withApi,
}: {
  connected: number;
  withApi: number;
}) {
  return (
    <p className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-sm text-[var(--color-secondary)]">
      <span
        aria-hidden="true"
        className="inline-block size-2.5 rounded-full bg-[var(--color-accent)]"
      />
      <span>
        <strong className="font-semibold text-[var(--color-primary)]">{connected}</strong>{" "}
        proyectos conectados
      </span>
      <span aria-hidden="true" className="text-[var(--color-border-strong)]">
        ·
      </span>
      <span>
        <strong className="font-semibold text-[var(--color-primary)]">{withApi}</strong> con API
      </span>
    </p>
  );
}
