import { NextRequest, NextResponse } from "next/server";
import { getItems } from "@/lib/agg/aggregate";
import { federatedPersonSearch, personLinkOuts } from "@/lib/interop/person-finders";
import type { PersonMatch } from "@/lib/interop/pfif";
import { personSearchOn } from "@/lib/env";
import { rateLimit } from "@/lib/ratelimit";
import { clientIp } from "@/lib/client-ip";

/*
  Búsqueda UNIFICADA del hub. Una consulta devuelve lugares/recursos (plano
  público) y personas (plano PII, gated). Es POST: el término de búsqueda (que
  puede ser el nombre de una víctima) viaja en el BODY, no en la URL — así no
  entra en access-logs ni en historiales (antipatrón PII-en-URL).

  Same-origin, fuera de /api/v1 (puede contener personas). No-store, noindex.
  El plano de personas es FAIL-CLOSED: solo se consulta con intención explícita
  o ante una señal positiva de nombre.
*/
export const dynamic = "force-dynamic";

const SECURE = {
  "cache-control": "no-store",
  "x-robots-tag": "noindex",
  "referrer-policy": "no-referrer",
} as const;

const ONLY_ID = /^[VEJGP]?-?\d{6,9}$/i;

// Palabras de lugar/recurso (sin tildes; comparadas normalizadas).
const RESOURCE_WORDS = new Set([
  "agua", "comida", "alimento", "alimentos", "refugio", "refugios", "albergue",
  "albergues", "donar", "donacion", "donaciones", "acopio", "medicina", "medicinas",
  "medicamento", "medicamentos", "gas", "electricidad", "sismo", "terremoto",
  "replica", "replicas", "alerta", "alertas", "ayuda", "voluntario", "voluntariado",
  "sangre", "ropa", "dinero", "panales", "kit", "insumos", "recurso", "recursos",
]);

function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/** Señal POSITIVA de nombre: ≥2 tokens de solo letras y no todos son recursos. */
function looksLikeName(q: string): boolean {
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return false;
  if (!tokens.every((t) => /^[a-zñ'.-]+$/.test(t))) return false;
  if (tokens.every((t) => RESOURCE_WORDS.has(t))) return false;
  return true;
}

/** FAIL-CLOSED: personas solo con intención explícita o señal de nombre. */
function wantsPersons(q: string, kind: string | null): boolean {
  if (kind === "place") return false;
  if (kind === "person") return true;
  return looksLikeName(q);
}

type Persons = {
  matches: PersonMatch[];
  gated: boolean;
  wanted: boolean;
  throttled?: boolean;
  nonFederated?: { name: string; url: string }[];
};

export async function POST(req: NextRequest) {
  let body: { q?: unknown; kind?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* body vacío/no-JSON */
  }
  const q = (typeof body.q === "string" ? body.q : "").trim().slice(0, 80);
  const kind = body.kind === "person" || body.kind === "place" ? body.kind : null;

  const wanted = wantsPersons(q, kind);

  if (q.length < 2) {
    return NextResponse.json(
      { q, total: 0, items: [], persons: { matches: [], gated: !personSearchOn, wanted } satisfies Persons },
      { headers: SECURE }
    );
  }

  // Lugares y recursos (NO-PII, siempre).
  const { items, meta } = await getItems({ q, limit: 12 });

  // Personas (PII): fail-closed por intención + gated + rate-limit + anti-oráculo.
  let persons: Persons = { matches: [], gated: !personSearchOn, wanted };
  if (wanted) {
    // "Busca también aquí": siempre ofrecemos las plataformas de personas.
    persons.nonFederated = personLinkOuts();
    if (personSearchOn && q.length >= 3 && !ONLY_ID.test(q)) {
      if (!rateLimit(`persons:${clientIp(req)}`).ok) {
        persons.throttled = true;
      } else {
        const r = await federatedPersonSearch({ name: q });
        persons = {
          matches: r.matches,
          gated: false,
          wanted,
          nonFederated: r.nonFederated.length ? r.nonFederated : personLinkOuts(),
        };
      }
    }
  }

  return NextResponse.json({ q, total: meta.total, items, persons }, { headers: SECURE });
}
