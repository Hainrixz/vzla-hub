import { createHash } from "node:crypto";
import type { AggItem } from "./types";

/** Quita utm_*, fbclid y el fragmento; normaliza host para una URL canónica estable. */
export function canonicalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = "";
    const drop = [...u.searchParams.keys()].filter(
      (k) => k.startsWith("utm_") || k === "fbclid" || k === "gclid" || k === "ref"
    );
    drop.forEach((k) => u.searchParams.delete(k));
    u.hostname = u.hostname.replace(/^www\./, "");
    return u.toString();
  } catch {
    return raw.trim();
  }
}

/** sha256 estable a partir de título + URL canónica (clave de dedup). */
export function contentHash(title: string, url: string): string {
  return createHash("sha256")
    .update(`${title.trim().toLowerCase()}::${canonicalizeUrl(url)}`)
    .digest("hex");
}

/** record_id con namespace propio (para futura interop/export). */
export function recordId(hash: string): string {
  return `buscavzla.org/i.${hash.slice(0, 12)}`;
}

/** Dedup exacto por contentHash (v1). SimHash/embeddings llegan con la DB. */
export function dedupe(items: AggItem[]): AggItem[] {
  const seen = new Map<string, AggItem>();
  for (const it of items) {
    const key = it.provenance.contentHash;
    const prev = seen.get(key);
    // Conserva el de mayor confianza (tier menor) o el más reciente.
    if (
      !prev ||
      it.trustTier < prev.trustTier ||
      (it.trustTier === prev.trustTier && it.publishedAt > prev.publishedAt)
    ) {
      seen.set(key, it);
    }
  }
  return [...seen.values()];
}

/** Distancia aproximada (km) entre dos puntos — para filtro `near`. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
