/*
  Modelo unificado del motor de agregación (plano de datos `agg`, SIN PII).
  Un solo tipo de item normalizado para fuentes heterogéneas. Cada item lleva
  procedencia obligatoria (de dónde salió, cuándo, con qué método y licencia) y
  un tier de confianza. Regla: atribuir, no aseverar.
*/

export type ItemType =
  | "official_alert" // alerta/sismo oficial (USGS, GDACS) → forma CAP
  | "situation_report" // sitrep humanitario (ReliefWeb/OCHA)
  | "news" // noticia (enlace + titular + extracto; nunca texto completo)
  | "resource" // recurso/albergue/servicio
  | "donation_appeal" // llamamiento de donación (link-only)
  | "zone_signal" // señal agregada y anonimizada ligada a una zona gruesa (Puente VE)
  | "missing_person"; // puntero a registro de personas (enlace + conteo, SIN PII)

/** 1 = oficial/autoritativo … 4 = social sin verificar. */
export type TrustTier = 1 | 2 | 3 | 4;

export type VerificationStatus =
  | "verified" // de una fuente oficial autoritativa
  | "corroborated" // varias fuentes coinciden
  | "unverified" // sin confirmar (de-amplificar + etiquetar)
  | "disputed"
  | "debunked";

export type IngestMethod = "api" | "feed" | "scrape" | "partner";

/** Procedencia: viaja con cada item y en cada respuesta de la API. */
export type Provenance = {
  source: string; // id de la fuente en el registro
  sourceName: string;
  sourceUrl: string; // URL canónica del item en la fuente
  fetchedAt: string; // ISO
  method: IngestMethod;
  license: string;
  trustTier: TrustTier;
  contentHash: string; // sha256(title + url canónica)
};

export type GeoPoint = { lat: number; lng: number } | null;

export type AggItem = {
  id: string; // record_id namespaced: buscavzla.org/i.<hash8>
  type: ItemType;
  title: string;
  summary: string | null; // extracto corto; nunca el cuerpo completo de algo con copyright
  url: string; // enlace canónico a la fuente original (siempre link-out)
  lang: string; // 'es' | 'en' | …
  geo: GeoPoint; // nivel zona si va ligado a personas
  publishedAt: string; // ISO
  trustTier: TrustTier;
  verificationStatus: VerificationStatus;
  provenance: Provenance;
  /** Datos crudos seguros (no-PII) específicos del tipo: magnitud, alertLevel, etc. */
  extra?: Record<string, string | number | null>;
};
