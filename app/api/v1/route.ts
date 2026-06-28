import { NextResponse } from "next/server";

// Índice de la API pública: descubrimiento para consumidores (p.ej. Kontigo).
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(
    {
      apiVersion: "v1",
      name: "busca-vzla API",
      description:
        "API pública del HUB de ayuda del sismo de Venezuela (2026). Datos agregados NO-PII con procedencia. Atribuir, no aseverar.",
      endpoints: {
        items: "GET /api/v1/items",
        sources: "GET /api/v1/sources",
        partners: "GET /api/v1/partners",
        stats: "GET /api/v1/stats",
        interopSchema: "GET /api/v1/interop/schema",
      },
      docs: "https://busca-vzla.org/conectar",
      legal: { terms: "https://busca-vzla.org/terminos", privacy: "https://busca-vzla.org/privacidad" },
    },
    { headers: { "cache-control": "public, s-maxage=3600" } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
