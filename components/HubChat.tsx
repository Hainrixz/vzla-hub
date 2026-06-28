"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  ArrowUp,
  ExternalLink,
  Loader2,
  Users,
  MapPin,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { AggItemCard } from "@/components/AggItemCard";
import type { AggItem } from "@/lib/agg/types";
import type { PersonMatch } from "@/lib/interop/pfif";

const SUGGESTIONS: { label: string; q: string }[] = [
  { label: "Agua potable", q: "agua" },
  { label: "Refugios", q: "refugio" },
  { label: "Centros de acopio", q: "acopio" },
  { label: "Dónde donar", q: "donar" },
  { label: "Estado del sismo", q: "sismo" },
];

const MODES: { key: Mode; label: string }[] = [
  { key: "auto", label: "Todo" },
  { key: "person", label: "Personas" },
  { key: "place", label: "Lugares" },
];

const STATUS_LABEL: Record<string, string> = {
  believed_missing: "Desaparecido/a",
  believed_alive: "Encontrado/a · a salvo",
  believed_dead: "Fallecido/a",
  information_sought: "Se busca información",
};

type Mode = "auto" | "person" | "place";
type LinkOut = { name: string; url: string };
type Persons = {
  matches: PersonMatch[];
  gated: boolean;
  wanted: boolean;
  throttled?: boolean;
  nonFederated?: LinkOut[];
};
type SearchData = { q: string; total: number; items: AggItem[]; persons: Persons };
type Msg = {
  id: number;
  role: "user" | "assistant";
  query?: string;
  kind?: Mode;
  data?: SearchData;
  loading?: boolean;
  error?: boolean;
};

function resumen(d: SearchData): string {
  const p = d.persons.matches.length;
  const i = d.items.length;
  if (d.persons.throttled && i === 0)
    return "Demasiadas búsquedas seguidas. Espera unos segundos e inténtalo de nuevo.";
  if (p === 0 && i === 0)
    return `No encontré resultados para “${d.q}”. Prueba con otras palabras${d.persons.wanted ? " o busca en las plataformas de abajo" : ""}.`;
  const partes: string[] = [];
  if (p > 0) partes.push(`${p} persona${p === 1 ? "" : "s"}`);
  if (i > 0) partes.push(`${i} lugar${i === 1 ? "" : "es"} y recursos`);
  return `Encontré ${partes.join(" y ")} para “${d.q}”.`;
}

export function HubChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<Mode>("auto");
  const [live, setLive] = useState("");
  const counter = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const empty = messages.length === 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function run(raw: string, kind: Mode = "auto") {
    const q = raw.trim();
    if (q.length < 2) return;
    setValue("");
    setLive("Buscando en el hub…");
    const userId = ++counter.current;
    const botId = ++counter.current;
    setMessages((m) => [
      ...m,
      { id: userId, role: "user", query: q },
      { id: botId, role: "assistant", query: q, kind, loading: true },
    ]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ q, kind: kind === "auto" ? undefined : kind }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as SearchData;
      setLive(resumen(data));
      setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, loading: false, data } : msg)));
    } catch {
      setLive("No pudimos completar la búsqueda.");
      setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, loading: false, error: true } : msg)));
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      {/* Título persistente para lectores de pantalla (siempre presente). */}
      <h1 className="sr-only">Buscador de la crisis — sismo Venezuela 2026</h1>
      {/* Una sola región de estado para anunciar resultados. */}
      <p role="status" aria-live="polite" className="sr-only">
        {live}
      </p>

      {/* Estado vacío: prompt + sugerencias */}
      {empty && (
        <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 text-center">
          <p className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
            ¿Qué necesitas encontrar?
          </p>
          <p className="mt-2 max-w-md text-[var(--color-secondary)]">
            Escribe el <strong>nombre de una persona</strong> que buscas, o un lugar
            o recurso. Reunimos la información de la crisis para que la encuentres
            aquí mismo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => run(s.q, "place")}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-secondary)] transition-colors duration-200 hover:border-[var(--color-border-strong)] cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversación */}
      {!empty && (
        <div role="log" aria-label="Resultados de búsqueda" className="flex flex-1 flex-col gap-6 py-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setLive("");
              }}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Nueva búsqueda
            </button>
          </div>

          {messages.map((msg) =>
            msg.role === "user" ? (
              <p
                key={msg.id}
                className="self-end rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
              >
                <span className="sr-only">Tú: </span>
                {msg.query}
              </p>
            ) : (
              <div key={msg.id} className="flex flex-col gap-3">
                <span className="sr-only">Resultado: </span>
                {msg.loading ? (
                  <p className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Buscando en el hub…
                  </p>
                ) : msg.error ? (
                  <div className="flex flex-col items-start gap-2 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <p className="inline-flex items-center gap-2 text-sm text-[var(--color-danger)]">
                      <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
                      No pudimos conectar. Revisa tu internet e inténtalo de nuevo.
                    </p>
                    <button
                      type="button"
                      onClick={() => run(msg.query ?? "", msg.kind ?? "auto")}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
                    >
                      <RotateCcw className="size-4" aria-hidden="true" />
                      Reintentar
                    </button>
                  </div>
                ) : msg.data ? (
                  <>
                    <p className="text-sm text-[var(--color-secondary)]">{resumen(msg.data)}</p>

                    {msg.data.persons.matches.length > 0 && (
                      <section className="flex flex-col gap-2">
                        <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary)]">
                          <Users className="size-4" aria-hidden="true" /> Personas
                        </h2>
                        <ul className="flex flex-col gap-2">
                          {msg.data.persons.matches.slice(0, 8).map((m, i) => (
                            <li
                              key={`${m.partnerId}-${i}`}
                              className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                            >
                              <span className="text-sm">
                                <span className="font-semibold text-[var(--color-primary)]">
                                  {m.displayName ?? "Coincidencia"}
                                </span>
                                <span className="text-[var(--color-muted)]">
                                  {m.ageRange ? ` · ${m.ageRange}` : ""}
                                  {m.status ? ` · ${STATUS_LABEL[m.status] ?? ""}` : ""} · {m.sourceName}
                                </span>
                              </span>
                              <a
                                href={m.linkOut}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-[44px] shrink-0 items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
                              >
                                Ver <ExternalLink className="size-4" aria-hidden="true" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* "Busca también aquí": no fragmentar la búsqueda */}
                    {msg.data.persons.wanted && (msg.data.persons.nonFederated?.length ?? 0) > 0 && (
                      <section className="flex flex-col gap-2">
                        <h2 className="text-sm font-bold text-[var(--color-primary)]">
                          Busca también en estas plataformas
                        </h2>
                        <ul className="flex flex-col gap-1.5">
                          {msg.data.persons.nonFederated!.map((p) => (
                            <li key={p.url}>
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
                              >
                                {p.name} <ExternalLink className="size-3.5" aria-hidden="true" />
                              </a>
                            </li>
                          ))}
                        </ul>
                        {msg.data.persons.gated && (
                          <p className="text-xs text-[var(--color-muted)]">
                            El buscador unificado de personas se activa según la configuración del operador.
                          </p>
                        )}
                      </section>
                    )}

                    {msg.data.items.length > 0 && (
                      <section className="flex flex-col gap-2">
                        <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary)]">
                          <MapPin className="size-4" aria-hidden="true" /> Lugares y recursos
                        </h2>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {msg.data.items.map((it) => (
                            <AggItemCard key={it.id} item={it} />
                          ))}
                        </ul>
                      </section>
                    )}
                  </>
                ) : null}
              </div>
            )
          )}
          <div ref={endRef} />
        </div>
      )}

      {/* Input (siempre abajo, estilo chat) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value, mode);
        }}
        className="sticky bottom-[76px] z-10 mt-2 bg-[var(--color-background)] py-3 lg:bottom-3"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Intención: Todo / Personas / Lugares */}
        <div role="group" aria-label="Tipo de búsqueda" className="mb-2 flex justify-center gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={
                "inline-flex min-h-[36px] items-center rounded-full px-3 text-xs font-medium transition-colors duration-200 cursor-pointer " +
                (mode === m.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-2)] text-[var(--color-secondary)] hover:bg-[var(--color-border)]")
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden="true"
          />
          <label htmlFor="hub-chat-input" className="sr-only">
            Escribe lo que buscas
          </label>
          <input
            id="hub-chat-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="search"
            enterKeyHint="search"
            placeholder={mode === "person" ? "Escribe el nombre…" : "Escribe lo que buscas…"}
            className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pl-11 pr-16 text-base text-[var(--color-foreground)] shadow-sm outline-none focus-visible:border-[var(--color-accent)]"
          />
          <button
            type="submit"
            disabled={value.trim().length < 2}
            aria-label="Buscar"
            className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
          En una emergencia, llama al <a href="tel:911" className="font-medium underline">911</a>.
        </p>
      </form>
    </div>
  );
}
