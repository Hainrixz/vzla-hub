import { NextResponse } from "next/server";
import { partners } from "@/lib/partners";
import { sources } from "@/lib/agg/sources";

/*
  Directorio público de proyectos conectados (endpoint público, SIN PII).
  Espejo de `/api/v1/sources`. Para los federados, enriquece con el estado en
  vivo de su fuente en `lib/agg/sources.ts`.
*/
export const revalidate = 3600;

export async function GET() {
  const list = Object.values(partners).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    area: p.area,
    homepage: p.homepage ?? null,
    repo: p.repo ?? null,
    hasApi: p.hasApi,
    apiBase: p.apiBase ?? null,
    apiKind: p.apiKind,
    handlesPII: p.handlesPII,
    plane: p.plane,
    status: p.status,
    federated: p.federated,
    // Estado en vivo de la fuente federada (si aplica).
    sourceEnabled: p.sourceId ? (sources[p.sourceId]?.enabled ?? null) : null,
    lastVerified: p.lastVerified,
    license: p.license ?? null,
    dataSharing: p.dataSharing ?? null,
    notes: p.notes ?? null,
  }));

  return NextResponse.json(
    {
      apiVersion: "v1",
      partners: list,
      meta: {
        total: list.length,
        attribution:
          "Directorio de proyectos comunitarios registrados. Cada proyecto es responsable de sus propios datos.",
        disclaimer:
          "Registro neutral. busca-vzla no opera estas plataformas ni mezcla datos personales (PII) en este plano público.",
      },
    },
    { headers: { "cache-control": "public, s-maxage=3600" } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
