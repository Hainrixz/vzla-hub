import type { AggItem } from "../types";
import { sources } from "../sources";
import { canonicalizeUrl, contentHash, recordId } from "../normalize";

/*
  ReliefWeb v2 (UN OCHA). Requiere un appname APROBADO (registrar en
  apidoc.reliefweb.int). Hasta tener RELIEFWEB_APPNAME, este adaptador no se
  ejecuta (enabled:false en el registro). Sin scraping: API oficial o nada.
*/
const ENDPOINT = "https://api.reliefweb.int/v2/reports";

type RwReport = {
  fields?: {
    title?: string;
    url?: string;
    "date.created"?: string;
    date?: { created?: string };
    source?: { name?: string }[];
  };
};

export async function fetchReliefWeb(fetchedAt: string): Promise<AggItem[]> {
  const appname = process.env.RELIEFWEB_APPNAME;
  if (!appname) return []; // gated: sin appname aprobado no se ingiere

  const src = sources.reliefweb;
  const res = await fetch(`${ENDPOINT}?appname=${encodeURIComponent(appname)}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "busca-vzla/0.1 (+https://busca-vzla.org)",
    },
    body: JSON.stringify({
      limit: 25,
      profile: "list",
      query: { value: "Venezuela earthquake", fields: ["title", "body"] },
      fields: { include: ["title", "url", "date.created", "source.name"] },
      sort: ["date.created:desc"],
    }),
    next: { revalidate: 1800 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { data?: RwReport[] };

  const items: AggItem[] = [];
  for (const r of data.data ?? []) {
    const title = r.fields?.title;
    const link = r.fields?.url;
    if (!title || !link) continue;
    const url = canonicalizeUrl(link);
    const hash = contentHash(title, url);
    const created = r.fields?.["date.created"] ?? r.fields?.date?.created;
    items.push({
      id: recordId(hash),
      type: "situation_report",
      title,
      summary: r.fields?.source?.[0]?.name ?? null,
      url,
      lang: "en",
      geo: null,
      publishedAt: created ? new Date(created).toISOString() : fetchedAt,
      trustTier: 1,
      verificationStatus: "verified",
      provenance: {
        source: src.id,
        sourceName: src.name,
        sourceUrl: url,
        fetchedAt,
        method: "api",
        license: src.license,
        trustTier: 1,
        contentHash: hash,
      },
    });
  }
  return items;
}
