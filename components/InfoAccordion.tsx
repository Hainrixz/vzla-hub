import { ChevronDown } from "lucide-react";

/**
 * Acordeón accesible basado en <details> nativo: funciona sin JavaScript y
 * offline. Ideal para guías de seguridad y la sección anti-estafa.
 */
export function InfoAccordion({
  titulo,
  children,
  defaultOpen = false,
}: {
  titulo: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-[var(--color-primary)]">
        <span>{titulo}</span>
        <ChevronDown
          className="size-5 shrink-0 text-[var(--color-muted)] transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-4 pb-4 text-[var(--color-secondary)]">{children}</div>
    </details>
  );
}
