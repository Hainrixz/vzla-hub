import type { IngestMethod, TrustTier } from "./types";

/*
  Registro por fuente. Cada ingesta pasa por una de estas entradas y se bloquea
  si falta una compuerta (robots/ToS/login). Política de agregación responsable:
  feeds oficiales primero; scraping solo como excepción permitida; PII de
  personas jamás por scraping.
*/

export type SourceClass =
  | "official_api"
  | "official_feed"
  | "news"
  | "social"
  | "scrape"
  | "partner_api";

export type Source = {
  id: string;
  name: string;
  homepage: string;
  class: SourceClass;
  license: string;
  trustTier: TrustTier;
  method: IngestMethod;
  robotsOk: boolean;
  tosOk: boolean;
  loginRequired: boolean; // debe ser false para ingerir (regla sin-login)
  needsBrowser: boolean;
  /** Para partners: acuerdo de datos confirmado. Si false, no ingiere aunque enabled. */
  partnerAgreement?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationMethod?: "dns-txt" | "repo-file" | "email-domain";
  lastVerified: string; // ISO date
  enabled: boolean; // false = listo pero apagado (p.ej. falta appname)
  note?: string;
};

export const sources: Record<string, Source> = {
  usgs: {
    id: "usgs",
    name: "USGS Earthquakes",
    homepage: "https://earthquake.usgs.gov/",
    class: "official_feed",
    license: "Dominio público (US Gov)",
    trustTier: 1,
    method: "feed",
    robotsOk: true,
    tosOk: true,
    loginRequired: false,
    needsBrowser: false,
    lastVerified: "2026-06-27",
    enabled: true,
  },
  gdacs: {
    id: "gdacs",
    name: "GDACS (UN/EC)",
    homepage: "https://www.gdacs.org/",
    class: "official_feed",
    license: "GDACS / Copernicus-JRC (atribución)",
    trustTier: 1,
    method: "feed",
    robotsOk: true,
    tosOk: true,
    loginRequired: false,
    needsBrowser: false,
    lastVerified: "2026-06-27",
    enabled: true,
  },
  reliefweb: {
    id: "reliefweb",
    name: "ReliefWeb (UN OCHA)",
    homepage: "https://reliefweb.int/",
    class: "official_api",
    license: "ReliefWeb ToS (atribución; no comercial)",
    trustTier: 1,
    method: "api",
    robotsOk: true,
    tosOk: true,
    loginRequired: false,
    needsBrowser: false,
    lastVerified: "2026-06-27",
    enabled: false, // requiere un appname aprobado (RELIEFWEB_APPNAME) — registrar en apidoc.reliefweb.int
    note: "API v2 exige appname aprobado. Se habilita al definir RELIEFWEB_APPNAME.",
  },
  // --- Partners comunitarios (NO-PII) ---
  venezuela_solidaria: {
    id: "venezuela_solidaria",
    name: "Venezuela Solidaria",
    homepage: "https://www.venezuelasolidaria.com/",
    class: "partner_api",
    license: "Partner — Venezuela Solidaria (CORS abierto)",
    trustTier: 2,
    method: "partner",
    robotsOk: true,
    tosOk: true,
    loginRequired: false,
    needsBrowser: false,
    partnerAgreement: true,
    lastVerified: "2026-06-27",
    enabled: true,
    note: "GET público de recursos (donaciones/páginas/emergencia/quedadas).",
  },
  puente_ve: {
    id: "puente_ve",
    name: "Puente VE",
    homepage: "https://github.com/Fredoale/puente-ve",
    class: "partner_api",
    license: "Partner — Puente VE (stats anonimizadas)",
    trustTier: 2,
    method: "partner",
    robotsOk: true,
    tosOk: true,
    loginRequired: false,
    needsBrowser: false,
    partnerAgreement: true,
    lastVerified: "2026-06-27",
    enabled: false, // gated por env: requiere PUENTE_VE_URL + PUENTE_VE_ANON_KEY
    note: "RPC anonimizadas. Se habilita al definir PUENTE_VE_URL y PUENTE_VE_ANON_KEY.",
  },
};

export function enabledSources(): Source[] {
  return Object.values(sources).filter(
    (s) =>
      s.enabled &&
      s.tosOk &&
      s.robotsOk &&
      !s.loginRequired &&
      (s.partnerAgreement ?? true) // belt-and-suspenders para partners
  );
}
