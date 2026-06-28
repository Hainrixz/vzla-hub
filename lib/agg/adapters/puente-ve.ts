import type { AggItem } from "../types";
import { sources } from "../sources";
import { contentHash, recordId } from "../normalize";
import { sanitizePartnerItem } from "../pii-guard";
import { puenteRowsSchema, rowsOf, pickString, pickNumber } from "../schemas";
import { puenteVe } from "@/lib/env";

/*
  Partner: Puente VE — RPC de solo lectura con datos ANONIMIZADOS (ubicación
  redondeada ~11 km). Declara que NO recolecta datos personales. Env-gated como
  ReliefWeb: sin PUENTE_VE_URL + PUENTE_VE_ANON_KEY no ingiere nada.

  Produce items `zone_signal`: señales agregadas de zona (pulso de necesidades y
  estadísticas de alertas), nunca pines de personas. Igual pasan por el guard.
*/
const UA = "busca-vzla/0.1 (+https://busca-vzla.org)";

async function callRpc(
  base: string,
  key: string,
  fn: string
): Promise<unknown | null> {
  try {
    const res = await fetch(`${base}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        accept: "application/json",
        "user-agent": UA,
      },
      body: "{}",
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchPuenteVe(fetchedAt: string): Promise<AggItem[]> {
  const src = sources.puente_ve;
  if (!src || !puenteVe) return []; // gate por env (como reliefweb)
  const { url: base, key } = puenteVe;

  const items: AggItem[] = [];
  const linkOut = src.homepage;

  const push = (title: string, summary: string | null, geo: AggItem["geo"], extra: AggItem["extra"], dedupeKey: string) => {
    const hash = contentHash(title, `${linkOut}#${dedupeKey}`);
    const candidate: AggItem = {
      id: recordId(hash),
      type: "zone_signal",
      title,
      summary,
      url: linkOut,
      lang: "es",
      geo,
      publishedAt: fetchedAt,
      trustTier: 2,
      verificationStatus: "unverified",
      provenance: {
        source: src.id,
        sourceName: src.name,
        sourceUrl: linkOut,
        fetchedAt,
        method: "partner",
        license: src.license,
        trustTier: 2,
        contentHash: hash,
      },
      extra,
    };
    const safe = sanitizePartnerItem(candidate); // recorta geo a centroide + descarta si hay PII
    if (safe) items.push(safe);
  };

  // Pulso de zona: una señal por zona (lat/lng gruesos, conteo, tipo dominante).
  const pulse = await callRpc(base, key, "zone_pulse");
  const pulseParsed = puenteRowsSchema.safeParse(pulse);
  if (pulseParsed.success) {
    for (const row of rowsOf(pulseParsed.data)) {
      const lat = pickNumber(row, ["lat", "latitude", "latitud"]);
      const lng = pickNumber(row, ["lng", "lon", "long", "longitude", "longitud"]);
      const count = pickNumber(row, ["count", "total", "n", "requests"]);
      const zone = pickString(row, ["zone", "zona", "name", "parroquia", "municipio", "label"]);
      const dominant = pickString(row, ["dominant_type", "tipo", "type", "need", "categoria"]);
      const title = `Pulso de zona${zone ? `: ${zone}` : ""}${count != null ? ` · ${count} señales` : ""}`;
      push(
        title,
        dominant ? `Necesidad dominante: ${dominant}` : null,
        lat != null && lng != null ? { lat, lng } : null,
        { signalKind: "zone_pulse", count: count ?? null, dominantType: dominant ?? null },
        `zone-${zone ?? `${lat},${lng}`}`
      );
    }
  }

  // Estadísticas de alertas: una señal resumen agregada.
  const stats = await callRpc(base, key, "public_alert_stats");
  const statsParsed = puenteRowsSchema.safeParse(stats);
  if (statsParsed.success) {
    const rows = rowsOf(statsParsed.data);
    const row = rows[0] ?? {};
    const total = pickNumber(row, ["total", "active", "count"]);
    const zonesN = pickNumber(row, ["zones", "zonas", "n_zones"]);
    if (total != null) {
      push(
        `Pedidos activos${total != null ? `: ${total}` : ""}${zonesN != null ? ` en ${zonesN} zonas` : ""}`,
        "Estadísticas anonimizadas de necesidades reportadas.",
        null,
        { signalKind: "alert_stats", total: total ?? null, zones: zonesN ?? null },
        "alert-stats"
      );
    }
  }

  return items;
}
