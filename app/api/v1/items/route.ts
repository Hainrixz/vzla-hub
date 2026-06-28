import { NextRequest, NextResponse } from "next/server";
import { getItems, type ItemFilter } from "@/lib/agg/aggregate";
import type { ItemType } from "@/lib/agg/types";

// La API pública es el producto; el hub es su primer consumidor.
export const revalidate = 300;

// `missing_person` NO se expone en el plano público hasta que exista el núcleo
// seguro (gate REAL_DATA_INTAKE). Ningún adapter habilitado lo emite (ver
// invariante en lib/agg/aggregate.ts).
const TYPES = new Set<ItemType>([
  "official_alert",
  "situation_report",
  "news",
  "resource",
  "donation_appeal",
  "zone_signal",
]);

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filter: ItemFilter = {};

  const type = sp.get("type");
  if (type && TYPES.has(type as ItemType)) filter.type = type as ItemType;

  const source = sp.get("source");
  if (source) filter.source = source;

  const q = sp.get("q");
  if (q && q.trim()) filter.q = q.trim().slice(0, 80);

  const limit = sp.get("limit");
  if (limit && Number.isFinite(Number(limit))) filter.limit = parseInt(limit, 10);

  const offset = sp.get("offset");
  if (offset && Number.isFinite(Number(offset))) filter.offset = parseInt(offset, 10);

  const lat = sp.get("lat");
  const lng = sp.get("lng");
  const radius = sp.get("radiusKm");
  if (lat && lng && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
    filter.near = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radiusKm: radius && Number.isFinite(Number(radius)) ? parseFloat(radius) : 300,
    };
  }

  try {
    const result = await getItems(filter);
    return NextResponse.json(
      { apiVersion: "v1", ...result },
      {
        headers: {
          "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { apiVersion: "v1", error: "aggregation_failed" },
      { status: 502 }
    );
  }
}

// Preflight CORS (los headers Access-Control-* los aplica next.config.ts).
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
