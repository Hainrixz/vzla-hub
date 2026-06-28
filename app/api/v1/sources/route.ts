import { NextResponse } from "next/server";
import { sources } from "@/lib/agg/sources";

// Transparencia de fuentes y tiers de confianza (endpoint público).
export const revalidate = 3600;

export async function GET() {
  const list = Object.values(sources).map((s) => ({
    id: s.id,
    name: s.name,
    homepage: s.homepage,
    class: s.class,
    license: s.license,
    trustTier: s.trustTier,
    method: s.method,
    enabled: s.enabled,
    lastVerified: s.lastVerified,
    note: s.note ?? null,
  }));
  return NextResponse.json(
    { apiVersion: "v1", sources: list },
    { headers: { "cache-control": "public, s-maxage=3600" } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
