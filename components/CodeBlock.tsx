/** Bloque de código monospace (estética developer/status-page). Sin JS. */
export function CodeBlock({ label, code }: { label?: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface-2)]">
      {label && (
        <div className="border-b border-[var(--color-border)] px-3 py-1.5 font-mono text-xs text-[var(--color-muted)]">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-3 py-3 text-xs leading-relaxed">
        <code className="font-mono text-[var(--color-secondary)]">{code}</code>
      </pre>
    </div>
  );
}
