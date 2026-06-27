import type { AggItem } from "../types";
import { sources } from "../sources";
import { canonicalizeUrl, contentHash, recordId } from "../normalize";

// Sismos M4.5+ del último mes (GeoJSON, dominio público, sin llave).
const FEED =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Región amplia Caribe / norte de Sudamérica (relevante a Venezuela).
const BBOX = { minLat: -5, maxLat: 20, minLng: -85, maxLng: -55 };

type UsgsFeature = {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number | null;
    url: string;
    title: string;
    alert: string | null;
    tsunami: number;
  };
  geometry: { coordinates: [number, number, number] } | null;
};

export async function fetchUsgs(fetchedAt: string): Promise<AggItem[]> {
  const src = sources.usgs;
  const res = await fetch(FEED, {
    headers: { "user-agent": "busca-vzla/0.1 (+https://busca-vzla.org)" },
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { features: UsgsFeature[] };

  const items: AggItem[] = [];
  for (const f of data.features ?? []) {
    const g = f.geometry?.coordinates;
    if (!g) continue;
    const [lng, lat, depth] = g;
    if (lat < BBOX.minLat || lat > BBOX.maxLat || lng < BBOX.minLng || lng > BBOX.maxLng)
      continue;

    const url = canonicalizeUrl(f.properties.url);
    const title = f.properties.title || `M${f.properties.mag} ${f.properties.place ?? ""}`;
    const hash = contentHash(title, url);
    items.push({
      id: recordId(hash),
      type: "official_alert",
      title,
      summary: f.properties.place ?? null,
      url,
      lang: "en",
      geo: { lat, lng },
      publishedAt: new Date(f.properties.time ?? Date.now()).toISOString(),
      trustTier: 1,
      verificationStatus: "verified",
      provenance: {
        source: src.id,
        sourceName: src.name,
        sourceUrl: url,
        fetchedAt,
        method: "feed",
        license: src.license,
        trustTier: 1,
        contentHash: hash,
      },
      extra: {
        magnitude: f.properties.mag,
        depthKm: depth ?? null,
        alertLevel: f.properties.alert,
        tsunami: f.properties.tsunami,
      },
    });
  }
  return items;
}
