import type { AggItem, ItemType } from "./types";
import { enabledSources } from "./sources";
import { dedupe, haversineKm } from "./normalize";
import { sanitizePartnerItem } from "./pii-guard";
import { fetchUsgs } from "./adapters/usgs";
import { fetchGdacs } from "./adapters/gdacs";
import { fetchReliefWeb } from "./adapters/reliefweb";
import { fetchVenezuelaSolidaria } from "./adapters/venezuela-solidaria";
import { fetchPuenteVe } from "./adapters/puente-ve";

type AdapterFn = (fetchedAt: string) => Promise<AggItem[]>;

const ADAPTERS: Record<string, AdapterFn> = {
  usgs: fetchUsgs,
  gdacs: fetchGdacs,
  reliefweb: fetchReliefWeb,
  venezuela_solidaria: fetchVenezuelaSolidaria,
  puente_ve: fetchPuenteVe,
};

export type ItemFilter = {
  type?: ItemType;
  /** Varios tipos a la vez (OR). Útil para vistas tipo "ayuda". */
  types?: ItemType[];
  source?: string;
  /** Búsqueda de texto en título/resumen (case-insensitive). */
  q?: string;
  near?: { lat: number; lng: number; radiusKm: number };
  limit?: number;
  offset?: number;
};

export type SourceStatus = {
  ok: boolean;
  count: number;
  error?: string;
  fetchedAt: string;
};

export type ItemsResult = {
  items: AggItem[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    /** ¿hay más resultados más allá de esta página? */
    hasMore: boolean;
    sources: string[];
    /** Observabilidad de ingesta por fuente (no es un SLA). */
    sourceStatus: Record<string, SourceStatus>;
    /** Conteos sobre el set filtrado completo (antes de paginar). */
    byType: Record<string, number>;
    bySource: Record<string, number>;
    /** Items descartados por el invariante de seguridad (p.ej. PII/missing_person). */
    dropped: number;
    fetchedAt: string;
    attribution: string;
    disclaimer: string;
  };
};

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

/**
 * Orquestador del motor: corre los adaptadores HABILITADOS en paralelo (un
 * fallo no tumba al resto), normaliza, deduplica, filtra, ordena y pagina.
 * Tanto la API pública como el hub consumen esta misma función.
 */
export async function getItems(filter: ItemFilter = {}): Promise<ItemsResult> {
  const fetchedAt = new Date().toISOString();
  const active = enabledSources().filter((s) => !filter.source || s.id === filter.source);

  const settled = await Promise.allSettled(
    active.map((s) => (ADAPTERS[s.id] ? ADAPTERS[s.id](fetchedAt) : Promise.resolve([])))
  );

  // Estado por fuente: una caída es absorbida por allSettled pero queda visible.
  const sourceStatus: Record<string, SourceStatus> = {};
  let items: AggItem[] = [];
  settled.forEach((r, i) => {
    const id = active[i].id;
    if (r.status === "fulfilled") {
      sourceStatus[id] = { ok: true, count: r.value.length, fetchedAt };
      items.push(...r.value);
    } else {
      // Error genérico en el plano público (no reimprimir reason: podría llevar URL/credencial).
      sourceStatus[id] = { ok: false, count: 0, error: "source_unavailable", fetchedAt };
    }
  });

  // INVARIANTE de seguridad (red final, además del guard de cada adapter):
  // (1) el plano público nunca emite PII (`missing_person`);
  // (2) todo item de partner re-pasa por el guard anti-PII (idempotente).
  const beforeInvariant = items.length;
  items = items
    .filter((i) => i.type !== "missing_person")
    .map((i) => (i.provenance.method === "partner" ? sanitizePartnerItem(i) : i))
    .filter((i): i is AggItem => i !== null);
  const dropped = beforeInvariant - items.length;

  items = dedupe(items);
  if (filter.type) items = items.filter((i) => i.type === filter.type);
  if (filter.types && filter.types.length)
    items = items.filter((i) => filter.types!.includes(i.type));
  if (filter.q) {
    const q = filter.q.toLowerCase();
    items = items.filter(
      (i) => i.title.toLowerCase().includes(q) || (i.summary?.toLowerCase().includes(q) ?? false)
    );
  }
  if (filter.near) {
    const n = filter.near;
    items = items.filter((i) => i.geo && haversineKm(n, i.geo) <= n.radiusKm);
  }
  items.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const total = items.length;
  const limit = Math.min(Math.max(1, filter.limit ?? DEFAULT_LIMIT), MAX_LIMIT);
  const offset = Math.max(0, filter.offset ?? 0);

  // Conteos sobre el set filtrado completo (no solo la página).
  const byType: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  for (const it of items) {
    byType[it.type] = (byType[it.type] ?? 0) + 1;
    bySource[it.provenance.source] = (bySource[it.provenance.source] ?? 0) + 1;
  }

  const attribution =
    active.length > 0
      ? `Datos de ${active.map((s) => s.name).join(" · ")}. La atribución corresponde a cada fuente.`
      : "Sin fuentes activas.";

  return {
    items: items.slice(offset, offset + limit),
    meta: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
      sources: active.map((s) => s.id),
      sourceStatus,
      byType,
      bySource,
      dropped,
      fetchedAt,
      attribution,
      disclaimer:
        "Agregado de fuentes públicas. No es un canal oficial. Verifica en la fuente antes de actuar.",
    },
  };
}
