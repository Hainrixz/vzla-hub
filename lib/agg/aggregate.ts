import type { AggItem, ItemType } from "./types";
import { enabledSources } from "./sources";
import { dedupe, haversineKm } from "./normalize";
import { fetchUsgs } from "./adapters/usgs";
import { fetchGdacs } from "./adapters/gdacs";
import { fetchReliefWeb } from "./adapters/reliefweb";

type AdapterFn = (fetchedAt: string) => Promise<AggItem[]>;

const ADAPTERS: Record<string, AdapterFn> = {
  usgs: fetchUsgs,
  gdacs: fetchGdacs,
  reliefweb: fetchReliefWeb,
};

export type ItemFilter = {
  type?: ItemType;
  source?: string;
  near?: { lat: number; lng: number; radiusKm: number };
  limit?: number;
  offset?: number;
};

export type ItemsResult = {
  items: AggItem[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    sources: string[];
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
  let items = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  items = dedupe(items);
  if (filter.type) items = items.filter((i) => i.type === filter.type);
  if (filter.near) {
    const n = filter.near;
    items = items.filter((i) => i.geo && haversineKm(n, i.geo) <= n.radiusKm);
  }
  items.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const total = items.length;
  const limit = Math.min(Math.max(1, filter.limit ?? DEFAULT_LIMIT), MAX_LIMIT);
  const offset = Math.max(0, filter.offset ?? 0);

  return {
    items: items.slice(offset, offset + limit),
    meta: {
      total,
      limit,
      offset,
      sources: active.map((s) => s.id),
      fetchedAt,
      attribution:
        "Datos de USGS (dominio público) y GDACS (UN/EC). La atribución corresponde a cada fuente.",
      disclaimer:
        "Agregado de fuentes públicas. No es un canal oficial. Verifica en la fuente antes de actuar.",
    },
  };
}
