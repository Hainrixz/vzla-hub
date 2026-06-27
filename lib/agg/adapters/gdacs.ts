import { XMLParser } from "fast-xml-parser";
import type { AggItem } from "../types";
import { sources } from "../sources";
import { canonicalizeUrl, contentHash, recordId } from "../normalize";

// GDACS RSS de eventos de desastre (XML). Atribución requerida.
const FEED = "https://www.gdacs.org/xml/rss.xml";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true, // gdacs:eventtype -> eventtype, geo:lat -> lat
});

type GdacsItem = Record<string, unknown>;

function str(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === "object" && "#text" in (v as object))
    return String((v as { "#text": unknown })["#text"]);
  return String(v);
}
function num(v: unknown): number | null {
  const s = str(v);
  const n = s == null ? NaN : Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function fetchGdacs(fetchedAt: string): Promise<AggItem[]> {
  const src = sources.gdacs;
  const res = await fetch(FEED, {
    headers: { "user-agent": "busca-vzla/0.1 (+https://busca-vzla.org)" },
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  const doc = parser.parse(xml) as {
    rss?: { channel?: { item?: GdacsItem | GdacsItem[] } };
  };
  const raw = doc.rss?.channel?.item;
  const list: GdacsItem[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const items: AggItem[] = [];
  for (const it of list) {
    const title = str(it.title);
    const link = str(it.link);
    if (!title || !link) continue;
    const url = canonicalizeUrl(link);
    const hash = contentHash(title, url);
    // geo:Point → { lat, long } tras removeNSPrefix; georss:point → "lat long".
    const point = it.Point as Record<string, unknown> | undefined;
    let lat = num(point?.lat);
    let lng = num(point?.long ?? point?.lon);
    if ((lat == null || lng == null) && typeof it.point === "string") {
      const [a, b] = String(it.point).trim().split(/\s+/).map(Number);
      if (Number.isFinite(a) && Number.isFinite(b)) {
        lat = a;
        lng = b;
      }
    }
    const pub = str(it.pubDate);

    items.push({
      id: recordId(hash),
      type: "official_alert",
      title,
      summary: str(it.description)?.replace(/<[^>]+>/g, "").slice(0, 280) ?? null,
      url,
      lang: "en",
      geo: lat != null && lng != null ? { lat, lng } : null,
      publishedAt: pub ? new Date(pub).toISOString() : fetchedAt,
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
        eventType: str(it.eventtype),
        alertLevel: str(it.alertlevel),
        country: str(it.country),
      },
    });
  }
  return items;
}
