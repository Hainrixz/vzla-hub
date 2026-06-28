import type { AggItem, ItemType } from "../types";
import { sources } from "../sources";
import { canonicalizeUrl, contentHash, recordId } from "../normalize";
import { sanitizePartnerItem } from "../pii-guard";
import { vsListSchema, rowsOf, pickString, toIso } from "../schemas";

/*
  Partner: Venezuela Solidaria — directorio comunitario con API pública abierta
  (CORS). Datos NO-PII (recursos, donaciones, páginas, jornadas). Federado a
  /api/v1/items con method "partner", trustTier 2 y verificationStatus
  "unverified" (de-amplificar + etiquetar).

  donation_appeal = SOLO ENLACE: no copiamos la descripción (puede traer
  instrucciones de pago). El resto pasa además por el guard anti-PII.
*/
const UA = "busca-vzla/0.1 (+https://busca-vzla.org)";
// Respuesta real: { items: [{ title, description, url, link, category, created_at,
// updated_at, … }] }. No filtramos por country (los datos usan "Venezuela"/null).
const ENDPOINT = "https://api.venezuelasolidaria.com/api/v1/resources?limit=50";

export async function fetchVenezuelaSolidaria(fetchedAt: string): Promise<AggItem[]> {
  const src = sources.venezuela_solidaria;
  if (!src) return [];

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      headers: { "user-agent": UA, accept: "application/json" },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
    });
  } catch {
    return [];
  }
  if (!res.ok) return [];

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return [];
  }
  const parsed = vsListSchema.safeParse(json);
  if (!parsed.success) return [];

  const items: AggItem[] = [];
  for (const row of rowsOf(parsed.data)) {
    const title = pickString(row, ["title", "name", "nombre", "titulo"]);
    const link = pickString(row, ["url", "link", "website", "sitio", "enlace"]);
    if (!title || !link) continue;

    const url = canonicalizeUrl(link);
    const category = (pickString(row, ["category", "categoria", "type", "tipo"]) ?? "").toLowerCase();
    const type: ItemType = category.includes("donac") ? "donation_appeal" : "resource";
    const descripcion = pickString(row, ["description", "descripcion", "detalle", "resumen"]);
    const hash = contentHash(title, url);

    const candidate: AggItem = {
      id: recordId(hash),
      type,
      title,
      summary:
        type === "donation_appeal" || !descripcion ? null : descripcion.slice(0, 280),
      url,
      lang: "es",
      geo: null, // un recurso es una organización, no una víctima
      publishedAt: toIso(
        pickString(row, ["updated_at", "created_at", "updatedAt", "createdAt", "date", "fecha"]),
        fetchedAt
      ),
      trustTier: 2,
      verificationStatus: "unverified",
      provenance: {
        source: src.id,
        sourceName: src.name,
        sourceUrl: url,
        fetchedAt,
        method: "partner",
        license: src.license,
        trustTier: 2,
        contentHash: hash,
      },
      extra: { category: category || null },
    };

    const safe = sanitizePartnerItem(candidate);
    if (safe) items.push(safe);
  }
  return items;
}
