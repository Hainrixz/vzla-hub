/*
  Esquema común de interoperabilidad de PERSONAS, alineado a PFIF (Person Finder
  Interchange Format). busca-vzla PUBLICA este estándar para que las apps de
  desaparecidos (VenezuelAyuda, BlazeAID, etc.) se conecten con una estructura
  compartida — responde su petición explícita de "estructura común".

  Reglas de privacidad embebidas en el contrato:
  - `ageRange` (rango), NUNCA fecha de nacimiento → protege a menores.
  - `homeCity`/`homeState` a nivel de zona; NUNCA dirección exacta ni coordenadas
    precisas (solo centroide de parroquia).
  - `photoUrl` la aloja el partner; busca-vzla no la espeja.
  - El HUB no almacena PII: federa la búsqueda y devuelve enlaces a la fuente.
*/

export type PfifStatus =
  | "information_sought"
  | "believed_alive"
  | "believed_missing"
  | "believed_dead";

export type PfifPerson = {
  personRecordId: string; // namespaced, p.ej. "venezuelayuda.org/p.123"
  sourceName: string;
  sourceUrl: string;
  sourceDate: string; // ISO
  entryDate?: string;
  expiryDate?: string;
  fullName?: string;
  givenName?: string;
  familyName?: string;
  sex?: "female" | "male" | "other";
  ageRange?: string; // "0-5", "18-30"… NUNCA fecha de nacimiento
  homeCity?: string;
  homeState?: string; // nivel zona; nunca dirección exacta
  photoUrl?: string; // alojada por el partner
  status?: PfifStatus;
};

/** Resultado mínimo que el buscador federado devuelve (link-out, SIN PII). */
export type PersonMatch = {
  partnerId: string;
  sourceName: string;
  displayName?: string;
  ageRange?: string;
  status?: PfifStatus;
  linkOut: string; // enlace a la ficha en la fuente
};

export type PersonQuery = {
  name: string; // obligatorio (anti-oráculo: prohibido buscar solo por cédula)
  city?: string;
  state?: string;
};

/** JSON Schema publicado en /api/v1/interop/schema (consumible por partners). */
export const PFIF_JSON_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://busca-vzla.org/api/v1/interop/schema",
  title: "busca-vzla PFIF Person (subset)",
  type: "object",
  required: ["personRecordId", "sourceName", "sourceUrl", "sourceDate"],
  additionalProperties: false,
  properties: {
    personRecordId: { type: "string", description: "Id namespaced por la fuente." },
    sourceName: { type: "string" },
    sourceUrl: { type: "string", format: "uri" },
    sourceDate: { type: "string", format: "date-time" },
    entryDate: { type: "string", format: "date-time" },
    expiryDate: { type: "string", format: "date-time" },
    fullName: { type: "string" },
    givenName: { type: "string" },
    familyName: { type: "string" },
    sex: { type: "string", enum: ["female", "male", "other"] },
    ageRange: {
      type: "string",
      description: "Rango de edad (p.ej. '0-5'). NUNCA fecha de nacimiento.",
    },
    homeCity: { type: "string" },
    homeState: { type: "string", description: "Nivel zona; nunca dirección exacta." },
    photoUrl: { type: "string", format: "uri", description: "Alojada por el partner." },
    status: {
      type: "string",
      enum: ["information_sought", "believed_alive", "believed_missing", "believed_dead"],
    },
  },
} as const;

export const PFIF_RULES = [
  "Atribuir, no aseverar: cada ficha enlaza a su fuente; busca-vzla no almacena PII.",
  "Edad como rango, nunca fecha de nacimiento (protección de menores).",
  "Ubicación a nivel de zona (centroide de parroquia); nunca dirección o coordenadas exactas.",
  "La foto la aloja y controla el partner; no se espeja.",
  "El buscador federado devuelve enlaces a la fuente; no concentra ni fusiona datos entre partners.",
] as const;
