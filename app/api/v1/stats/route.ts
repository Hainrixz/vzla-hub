import { NextResponse } from "next/server";
import { getItems } from "@/lib/agg/aggregate";
import { publicPartners } from "@/lib/partners";

/*
  Conteos agregados (endpoint público, sin PII): por tipo de item, por fuente y
  totales del directorio. Útil para badges y para consumidores como Kontigo.
*/
export const revalidate = 600;

export async function GET() {
  // limit:1 basta: los conteos de meta.byType/bySource cubren el set completo.
  const { meta } = await getItems({ limit: 1 });
  const partners = publicPartners();

  return NextResponse.json(
    {
      apiVersion: "v1",
      items: { total: meta.total, byType: meta.byType, bySource: meta.bySource },
      sources: { active: meta.sources, status: meta.sourceStatus },
      partners: {
        total: partners.length,
        withApi: partners.filter((p) => p.hasApi).length,
        federated: partners.filter((p) => p.federated).length,
      },
      fetchedAt: meta.fetchedAt,
    },
    { headers: { "cache-control": "public, s-maxage=600, stale-while-revalidate=1200" } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
