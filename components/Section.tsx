/** Encabezado de sección con título accesible y descripción opcional. */
export function Section({
  id,
  titulo,
  descripcion,
  children,
}: {
  id?: string;
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
}) {
  const headingId = id ? `${id}-titulo` : undefined;
  return (
    <section aria-labelledby={headingId} className="mb-10 scroll-mt-20" id={id}>
      <h2
        id={headingId}
        className="text-lg font-bold text-[var(--color-primary)]"
      >
        {titulo}
      </h2>
      {descripcion && (
        <p className="mt-1 mb-4 text-sm text-[var(--color-muted)]">{descripcion}</p>
      )}
      {!descripcion && <div className="mb-4" />}
      {children}
    </section>
  );
}
