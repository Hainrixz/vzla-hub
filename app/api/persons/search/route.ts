import { NextRequest, NextResponse } from "next/server";
import { federatedPersonSearch } from "@/lib/interop/person-finders";
import { personSearchOn } from "@/lib/env";
import { rateLimit } from "@/lib/ratelimit";

/*
  Buscador federado de personas — PROXY DE PASO.

  Vive FUERA de `/api/v1` (sin CORS) a propósito: es same-origin y nunca se expone
  cross-origin ni se publica en el schema interop. NO se cachea, NO se loguea la
  consulta. APAGADO por defecto (gate, mismo nivel que REAL_DATA_INTAKE).
*/
export const dynamic = "force-dynamic";

const SECURE_HEADERS = {
  "cache-control": "no-store",
  "x-robots-tag": "noindex",
  "referrer-policy": "no-referrer",
} as const;

// Anti-oráculo: una consulta que es SOLO una cédula/identificador no se acepta.
const ONLY_ID = /^[VEJGP]?-?\d{6,9}$/i;

export async function GET(req: NextRequest) {
  // GATE: el buscador está construido pero APAGADO hasta cerrar G0–G7.
  if (!personSearchOn) {
    return NextResponse.json(
      {
        error: "intake_gated",
        message: "El buscador de personas está en construcción y desactivado.",
      },
      { status: 503, headers: SECURE_HEADERS }
    );
  }

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 3 || ONLY_ID.test(q)) {
    return NextResponse.json(
      { error: "invalid_query", message: "Indica un nombre (mínimo 3 caracteres)." },
      { status: 400, headers: SECURE_HEADERS }
    );
  }

  // Rate-limit por IP. EN MEMORIA = ok para un solo nodo/dev; en serverless
  // multi-instancia usar Upstash (mismo contrato) — ver lib/ratelimit.ts.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  if (!rateLimit(`persons:${ip}`).ok) {
    return NextResponse.json(
      { error: "rate_limited", message: "Demasiadas búsquedas seguidas. Espera un momento." },
      { status: 429, headers: SECURE_HEADERS }
    );
  }

  // No se loguea `q` ni los resultados (PII en tránsito).
  const result = await federatedPersonSearch({ name: q });

  // Fallo total ≠ vacío: si se consultó y TODAS fallaron, error explícito (nunca
  // "no encontrado" falso, que sobre un desaparecido es daño real).
  if (result.queried.length > 0 && result.responded.length === 0) {
    return NextResponse.json(
      {
        error: "sources_unavailable",
        message: "No pudimos consultar las plataformas ahora. Reintenta o busca directamente.",
        nonFederated: result.nonFederated,
      },
      { status: 503, headers: SECURE_HEADERS }
    );
  }

  return NextResponse.json(
    {
      apiVersion: "v1",
      ...result,
      disclaimer:
        "Cobertura parcial: estos resultados no incluyen todas las plataformas. Busca también en las listadas como no federadas.",
    },
    { headers: SECURE_HEADERS }
  );
}
