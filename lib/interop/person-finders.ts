import { partners } from "@/lib/partners";
import { rowsOf } from "@/lib/agg/schemas";
import { scanPii } from "@/lib/agg/pii-guard";
import type { PersonMatch, PersonQuery, PfifStatus } from "./pfif";

/*
  Buscador federado de personas — PROXY DE PASO. NO almacena, NO cachea, NO
  loguea PII. Reenvía la consulta a las apps aliadas (con acuerdo firmado) y
  devuelve enlaces a la ficha en la fuente.

  Estado actual: CONSTRUIDO PERO APAGADO. `eligibleFinders()` solo incluye
  partners con `personSearch.eligible === true` y `consent === "signed-agreement"`.
  Hoy ninguno cumple, así que no se consulta a nadie hasta cerrar los gates G0–G7
  (ver el plan: "Workstream encuentralos go-live").

  Reglas duras:
  - PersonMatch lleva SOLO {displayName, ageRange, status, linkOut}. Nunca
    cédula/teléfono/hospital/coordenadas.
  - Sin correlación ni merge entre partners (cada match enlaza a su fuente).
  - Menores/biométrico/salud+ubicación nunca son elegibles.
*/

export type FederatedSearchResult = {
  matches: PersonMatch[];
  queried: string[]; // ids consultados
  responded: string[]; // ids que respondieron ok
  failed: string[];
  timedOut: string[];
  /** Plataformas no federadas para "busca también aquí" (link-out). */
  nonFederated: { name: string; url: string }[];
};

export interface PersonFinder {
  id: string;
  search(q: PersonQuery, signal: AbortSignal): Promise<PersonMatch[]>;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Mapea un estado libre del partner a un PfifStatus conocido (o undefined). */
export function toStatus(v: unknown): PfifStatus | undefined {
  const s = typeof v === "string" ? v.toLowerCase() : "";
  if (s.includes("encontrad") || s.includes("vivo") || s.includes("alive") || s.includes("salvo"))
    return "believed_alive";
  if (s.includes("falleci") || s.includes("dead")) return "believed_dead";
  if (s.includes("desaparec") || s.includes("missing")) return "believed_missing";
  return undefined;
}

/** Bucketiza una edad exacta en un rango (PFIF: nunca edad/fecha exacta). 0 = desconocida. */
export function ageBucket(v: unknown): string | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n) || n <= 0) return undefined;
  if (n <= 5) return "0-5";
  if (n <= 12) return "6-12";
  if (n <= 17) return "13-17";
  if (n <= 30) return "18-30";
  if (n <= 45) return "31-45";
  if (n <= 60) return "46-60";
  return "60+";
}

/** Nombre seguro para mostrar: descarta si trae PII embebida, capa longitud. */
export function safeName(v: unknown): string | undefined {
  const n = str(v);
  if (!n || scanPii(n).length > 0) return undefined;
  return n.slice(0, 80);
}

/*
  Finder: Encuentralos (APAGADO).

  La API real de Encuéntralos (GET /api/personas?q=) DEVUELVE PII: `nombre`,
  `cedula`, `reporta_contacto` (teléfono), `descripcion` (con direcciones),
  `foto`, `ultima_lat/lng`, `pv_*` (prueba de vida). Este finder es admisible
  SOLO porque hace allowlist estricta a {displayName, ageRange grueso, status,
  linkOut} y DESCARTA todo lo demás. Nunca copiar otros campos.
  Sigue eligible:false hasta cerrar G0/G1/G3 (legal, acuerdo, Upstash+Turnstile).
*/
const encuentralosFinder: PersonFinder = {
  id: "encuentralos",
  async search(q, signal) {
    const p = partners.encuentralos;
    if (!p?.apiBase) return [];
    const res = await fetch(
      `${p.apiBase}/api/personas?q=${encodeURIComponent(q.name)}&limit=25`,
      { headers: { accept: "application/json", "user-agent": "busca-vzla/0.1" }, signal }
    );
    if (!res.ok) return [];
    const json: unknown = await res.json();
    return rowsOf(json)
      .slice(0, 25)
      .map((r): PersonMatch => ({
        // ALLOWLIST: solo estos cuatro campos. NO copiar cedula/contacto/descripcion/foto/geo.
        partnerId: p.id,
        sourceName: p.name,
        displayName: safeName(r.nombre) ?? safeName(r.name),
        ageRange: ageBucket(r.edad),
        status: toStatus(r.estado),
        linkOut: p.homepage ?? p.apiBase!, // enlace a la fuente; nunca datos crudos
      }));
  },
};

const ALL_FINDERS: PersonFinder[] = [encuentralosFinder];

/** Finders marcados elegibles con una base de consentimiento (form-optin o acuerdo). */
function eligibleFinders(): PersonFinder[] {
  return ALL_FINDERS.filter((f) => {
    const ps = partners[f.id]?.personSearch;
    return ps?.eligible === true && ps.consent !== "none";
  });
}

/** Plataformas de personas con enlace, para "busca también aquí". */
export function personLinkOuts(excludeIds: string[] = []): { name: string; url: string }[] {
  return Object.values(partners)
    .filter((p) => p.area === "personas" && !!p.homepage && !excludeIds.includes(p.id))
    .map((p) => ({ name: p.name, url: p.homepage! }));
}

const TIMEOUT_MS = 5000;

export async function federatedPersonSearch(q: PersonQuery): Promise<FederatedSearchResult> {
  const finders = eligibleFinders();
  const queried = finders.map((f) => f.id);
  const responded: string[] = [];
  const failed: string[] = [];
  const timedOut: string[] = [];
  const matches: PersonMatch[] = [];

  await Promise.allSettled(
    finders.map(async (f) => {
      try {
        const r = await f.search(q, AbortSignal.timeout(TIMEOUT_MS));
        responded.push(f.id);
        for (const m of r) if (m.displayName) matches.push(m); // sin merge entre partners
      } catch (e) {
        if (e instanceof DOMException && e.name === "TimeoutError") timedOut.push(f.id);
        else failed.push(f.id);
      }
    })
  );

  return {
    matches,
    queried,
    responded,
    failed,
    timedOut,
    nonFederated: personLinkOuts(responded),
  };
}
