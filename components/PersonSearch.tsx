"use client";

import { useState } from "react";
import { Search, ExternalLink, Loader2, Info, AlertTriangle } from "lucide-react";

type Match = {
  partnerId: string;
  sourceName: string;
  displayName?: string;
  ageRange?: string;
  status?: string;
  linkOut: string;
};
type ApiResult = {
  matches: Match[];
  responded: string[];
  failed: string[];
  timedOut: string[];
  nonFederated: { name: string; url: string }[];
};
type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; data: ApiResult }
  | { kind: "error"; message: string };

/**
 * Buscador unificado de personas. Si el proxy está apagado (`enabled === false`),
 * muestra solo el aviso "en construcción". A11y: label visible, aria-live en los
 * resultados, estados diferenciados (cargando / sin resultados / error).
 */
export function PersonSearch({ enabled }: { enabled: boolean }) {
  const [q, setQ] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = q.trim();
    if (name.length < 3) {
      setState({ kind: "error", message: "Indica un nombre (mínimo 3 caracteres)." });
      return;
    }
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/persons/search?q=${encodeURIComponent(name)}`);
      if (res.status === 503) {
        setState({
          kind: "error",
          message:
            "No pudimos consultar las plataformas ahora. Reintenta o busca directamente en las plataformas de abajo.",
        });
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setState({ kind: "error", message: body?.message ?? "No se pudo completar la búsqueda." });
        return;
      }
      setState({ kind: "done", data: (await res.json()) as ApiResult });
    } catch {
      setState({ kind: "error", message: "Sin conexión. Revisa tu internet e inténtalo de nuevo." });
    }
  }

  if (!enabled) {
    return (
      <div className="flex items-start gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <Info
          className="size-5 shrink-0 mt-0.5 text-[var(--color-status-info)]"
          aria-hidden="true"
        />
        <p className="text-sm text-[var(--color-muted)]">
          El buscador unificado (que consulta varias plataformas a la vez) está en
          construcción y se activará de forma segura, sin exponer datos personales.
          Mientras tanto, busca directamente en las plataformas de abajo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="person-q" className="block text-sm font-semibold text-[var(--color-primary)]">
            Buscar a una persona por nombre
          </label>
          <input
            id="person-q"
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre y apellido"
            autoComplete="off"
            aria-describedby="person-q-hint"
            className="mt-1.5 w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-base text-[var(--color-foreground)] outline-none focus-visible:border-[var(--color-accent)]"
          />
          <p id="person-q-hint" className="mt-1 text-xs text-[var(--color-muted)]">
            Mínimo 3 caracteres. Busca por nombre, no por cédula.
          </p>
        </div>
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {state.kind === "loading" ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-5" aria-hidden="true" />
          )}
          Buscar
        </button>
      </form>

      <div role="status" aria-live="polite" className="mt-4">
        {state.kind === "loading" && (
          <p className="text-sm text-[var(--color-muted)]">Buscando en las plataformas conectadas…</p>
        )}

        {state.kind === "error" && (
          <p className="inline-flex items-start gap-2 text-sm text-[var(--color-danger)]">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
            {state.message}
          </p>
        )}

        {state.kind === "done" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[var(--color-muted)]">
              {state.data.matches.length === 0
                ? "Sin coincidencias en las plataformas consultadas. Esto no significa que la persona no esté: busca también en las de abajo."
                : `${state.data.matches.length} posible(s) coincidencia(s). Verifica siempre en la fuente.`}
            </p>
            {state.data.matches.length > 0 && (
              <ul className="flex flex-col gap-2">
                {state.data.matches.map((m, i) => (
                  <li
                    key={`${m.partnerId}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--color-border)] p-3"
                  >
                    <span className="text-sm">
                      <span className="font-semibold text-[var(--color-primary)]">
                        {m.displayName ?? "Coincidencia"}
                      </span>
                      <span className="text-[var(--color-muted)]">
                        {m.ageRange ? ` · ${m.ageRange}` : ""} · {m.sourceName}
                      </span>
                    </span>
                    <a
                      href={m.linkOut}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
                    >
                      Ver en la fuente
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
