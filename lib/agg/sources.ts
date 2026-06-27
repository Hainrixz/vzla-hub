import type { IngestMethod, TrustTier } from "./types";

/*
  Registro por fuente. Cada ingesta pasa por una de estas entradas y se bloquea
  si falta una compuerta (robots/ToS/login). Política de agregación responsable:
  feeds oficiales primero; scraping solo como excepción permitida; PII de
  personas jamás por scraping.
*/

export type SourceClass = "official_api" | "official_feed" | "news" | "social" | "scrape";

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
};

export function enabledSources(): Source[] {
  return Object.values(sources).filter((s) => s.enabled && s.tosOk && s.robotsOk && !s.loginRequired);
}
