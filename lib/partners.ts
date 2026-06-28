/*
  Registro de proyectos/apps comunitarias (partners) — PIVOTE busca-vzla.

  Este es el DIRECTORIO público del HUB: cataloga a cada proyecto que se sumó
  al esfuerzo de centralizar la información de la crisis. Vive en paralelo al
  registro técnico de fuentes (`lib/agg/sources.ts`):
    - `lib/agg/sources.ts` → "¿de qué endpoints NO-PII ingiero datos?" (compuertas).
    - `lib/partners.ts`     → "¿quiénes son, en qué plano viven, qué comparten?".
  Cruce: `Partner.sourceId` apunta a la entrada de `sources.ts` cuando el partner
  está federado a `/api/v1/items`.

  INVARIANTES DE SEGURIDAD (no son convención, se verifican):
  1. `handlesPII === true` ⇒ `federated === false` (ningún adapter lo produce).
  2. Menores/biométrico/salud+ubicación ⇒ nunca elegibles como finder de personas.
  3. Los emails del formulario NO se publican (anti-spam): contacto = homepage/repo.
*/

import {
  Users,
  HandCoins,
  LifeBuoy,
  Siren,
  HeartHandshake,
  Newspaper,
  LayoutGrid,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type PartnerArea =
  | "personas"
  | "donaciones"
  | "recursos"
  | "emergencia"
  | "voluntariado"
  | "informacion"
  | "directorio"
  | "seguridad";

export type ApiKind = "rest-json" | "supabase-rpc" | "openapi" | "none";
export type PartnerStatus = "live" | "beta" | "prototype" | "idea" | "directory-only";
export type DataPlane = "agg-public" | "pii-gated";
/*
  Base de consentimiento para habilitar un finder de personas:
  - "form-optin": el partner registró su API de lectura en el formulario (datos
    ya públicos en su sitio). Suficiente para el MVP, a decisión del operador.
  - "signed-agreement": acuerdo formal (requerido a escala / para datos sensibles).
  - "none": no habilita.
*/
export type PartnerConsent = "signed-agreement" | "form-optin" | "none";
export type VerificationMethod = "dns-txt" | "repo-file" | "email-domain";

export type Partner = {
  id: string;
  name: string;
  description: string;
  area: PartnerArea;
  homepage?: string;
  repo?: string;
  hasApi: boolean;
  apiBase?: string;
  apiKind: ApiKind;
  /** Maneja PII de víctimas. Si true ⇒ nunca se federa al plano público. */
  handlesPII: boolean;
  plane: DataPlane;
  status: PartnerStatus;
  /** Entra a `/api/v1/items` vía un adapter en `lib/agg/`. */
  federated: boolean;
  /** Id de la entrada en `lib/agg/sources.ts` (si federado). */
  sourceId?: string;
  /** Config del buscador de personas. eligible solo true tras cerrar los gates. */
  personSearch?: { eligible: boolean; consent: PartnerConsent; kind: ApiKind };
  verifiedBy?: string;
  verifiedAt?: string;
  verificationMethod?: VerificationMethod;
  lastVerified: string;
  license?: string;
  dataSharing?: string;
  notes?: string;
};

export const areaMeta: Record<PartnerArea, { label: string; icon: LucideIcon }> = {
  personas: { label: "Personas", icon: Users },
  donaciones: { label: "Donaciones", icon: HandCoins },
  recursos: { label: "Recursos", icon: LifeBuoy },
  emergencia: { label: "Emergencia", icon: Siren },
  voluntariado: { label: "Voluntariado", icon: HeartHandshake },
  informacion: { label: "Información", icon: Newspaper },
  directorio: { label: "Directorio", icon: LayoutGrid },
  seguridad: { label: "Seguridad", icon: ShieldCheck },
};

export const partnerStatusMeta: Record<
  PartnerStatus,
  { label: string; token: string }
> = {
  live: { label: "En vivo", token: "--color-live" },
  beta: { label: "Beta", token: "--color-beta" },
  prototype: { label: "Prototipo", token: "--color-prototype" },
  idea: { label: "En idea", token: "--color-idea" },
  "directory-only": { label: "Solo directorio", token: "--color-directory" },
};

/*
  Los 13 proyectos del formulario + 2 plataformas grandes ya presentes en
  `lib/links.ts` (reconciliación: evitar dos modelos de datos paralelos).
*/
export const partners: Record<string, Partner> = {
  // --- agg-público (federado o consumidor/directorio, SIN PII) ---
  venezuela_solidaria: {
    id: "venezuela_solidaria",
    name: "Venezuela Solidaria",
    description:
      "Directorio comunitario de recaudaciones, contactos de emergencia y jornadas de acopio, con API pública abierta.",
    area: "recursos",
    homepage: "https://www.venezuelasolidaria.com/",
    repo: "https://github.com/rmblockcode/venezuelasolidaria",
    hasApi: true,
    apiBase: "https://api.venezuelasolidaria.com",
    apiKind: "rest-json",
    handlesPII: false,
    plane: "agg-public",
    status: "live",
    federated: true,
    sourceId: "venezuela_solidaria",
    lastVerified: "2026-06-27",
    license: "Partner — Venezuela Solidaria (CORS abierto)",
    dataSharing: "GET público de recursos (donaciones, páginas, emergencia, quedadas).",
  },
  puente_ve: {
    id: "puente_ve",
    name: "Puente VE",
    description:
      "Hub anti-estafa del sismo 24-J: canales verificados y un pulso de necesidades por zona, con estadísticas anonimizadas.",
    area: "emergencia",
    homepage: "https://github.com/Fredoale/puente-ve",
    repo: "https://github.com/Fredoale/puente-ve",
    hasApi: true,
    apiBase: "https://jabbnqercoqetqqikoiv.supabase.co",
    apiKind: "supabase-rpc",
    handlesPII: false,
    plane: "agg-public",
    status: "live",
    federated: true,
    sourceId: "puente_ve",
    lastVerified: "2026-06-27",
    license: "Partner — Puente VE (stats anonimizadas)",
    dataSharing:
      "RPC de solo lectura con datos anonimizados (ubicación redondeada ~11 km). Declara que NO recolecta datos personales.",
  },
  kontigo: {
    id: "kontigo",
    name: "Kontigo App",
    description:
      "Fintech venezolana (+1.6M usuarios) que quiere consumir las APIs del HUB para mostrar información de ayuda dentro de su app.",
    area: "directorio",
    homepage: "https://kontigo.lat/",
    hasApi: false,
    apiKind: "none",
    handlesPII: false,
    plane: "agg-public",
    status: "directory-only",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "Consumidor de nuestra API, no proveedor. Caso de uso para CORS público.",
  },
  venezuelahelp: {
    id: "venezuelahelp",
    name: "Venezuelahelp",
    description:
      "Proyecto en fase temprana para centralizar información de páginas de ayuda.",
    area: "recursos",
    hasApi: false,
    apiKind: "none",
    handlesPII: false,
    plane: "agg-public",
    status: "directory-only",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "Plantea scraping: ingesta descartada (sin consentimiento, riesgo de PII).",
  },
  linuxshark: {
    id: "linuxshark",
    name: "Especialista en ciberseguridad (@linuxshark)",
    description:
      "Voluntario que se ofrece a revisar la seguridad de las apps y endpoints del esfuerzo común.",
    area: "seguridad",
    repo: "https://github.com/linuxshark",
    hasApi: false,
    apiKind: "none",
    handlesPII: false,
    plane: "agg-public",
    status: "directory-only",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "Recurso humano (auditoría), no un producto de datos.",
  },

  // --- pii-gated (personas) — directorio/enlace; NUNCA federados ---
  unoporciento_contigo: {
    id: "unoporciento_contigo",
    name: "unoporciento Contigo",
    description:
      "Buscador público de personas hospitalizadas tras el sismo (Caracas y La Guaira) por nombre o cédula.",
    area: "personas",
    homepage: "https://unoporcientocontigo.lat/",
    hasApi: true,
    apiBase: "https://unoporcientocontigo.lat/api",
    apiKind: "rest-json",
    handlesPII: true,
    plane: "pii-gated",
    status: "beta",
    federated: false,
    lastVerified: "2026-06-27",
    notes:
      "Devuelve nombre+cédula+centro hospitalario (salud+ubicación): EXCLUIDO del buscador unificado. Solo enlace.",
  },
  encuentralos: {
    id: "encuentralos",
    name: "Encuentralos",
    description:
      "Agentes con IA en WhatsApp y Telegram para ayudar a ubicar a familiares desaparecidos, con API documentada (OpenAPI).",
    area: "personas",
    homepage: "https://encuentralos.tecnosoft.dev/",
    hasApi: true,
    apiBase: "https://encuentralos.tecnosoft.dev",
    apiKind: "openapi",
    handlesPII: true,
    plane: "pii-gated",
    status: "beta",
    federated: false,
    // Finder ELEGIBLE (consintió vía formulario). El interruptor maestro es el
    // env PERSON_SEARCH_PROXY; los resultados se filtran a {nombre, rango de edad,
    // estado, enlace} — su API expone más PII que NO copiamos.
    personSearch: { eligible: true, consent: "form-optin", kind: "openapi" },
    lastVerified: "2026-06-27",
    notes:
      "Candidato del buscador. Su API expone cédula/teléfono/dirección; el finder los descarta y solo muestra nombre + rango de edad + estado + enlace.",
  },
  buscalosvzla: {
    id: "buscalosvzla",
    name: "buscalosvzla.org",
    description:
      "Publicación de listas y solicitudes de personas desaparecidas, con OCR de fotos a revisión.",
    area: "personas",
    homepage: "https://buscalosvzla.org/",
    hasApi: true,
    apiKind: "supabase-rpc",
    handlesPII: true,
    plane: "pii-gated",
    status: "live",
    federated: false,
    lastVerified: "2026-06-27",
    notes:
      "Expone Supabase REST crudo (anti-patrón regla #1): NO se le construye finder. Solo enlace.",
  },
  estoyaquivenezuela: {
    id: "estoyaquivenezuela",
    name: "Estoyaquivenezuela.com",
    description:
      "Reportar y buscar personas desaparecidas con match automático de contactos entre familias y rescatistas.",
    area: "personas",
    homepage: "https://estoyaquivenezuela.lovable.app/",
    hasApi: false,
    apiKind: "none",
    handlesPII: true,
    plane: "pii-gated",
    status: "prototype",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "Prototipo en planeación. Solo directorio.",
  },
  venezuelayuda: {
    id: "venezuelayuda",
    name: "VenezuelAyuda",
    description:
      "Directorio humanitario que unifica reportes de personas, ofertas y solicitudes de ayuda; abierto a una estructura común.",
    area: "personas",
    homepage: "https://venezuelayuda.com/",
    hasApi: false,
    apiKind: "supabase-rpc",
    handlesPII: true,
    plane: "pii-gated",
    status: "live",
    federated: false,
    // Finder futuro vía Supabase RPC anónimo, solo con acuerdo firmado.
    personSearch: { eligible: false, consent: "none", kind: "supabase-rpc" },
    lastVerified: "2026-06-27",
    dataSharing: "Pidió explícitamente una 'estructura común': consume el esquema PFIF publicado.",
  },
  blazeaid: {
    id: "blazeaid",
    name: "BlazeAID",
    description:
      "Plataforma open source de coordinación con API de ingestión propia (proyectos, recursos, desaparecidos, voluntarios).",
    area: "voluntariado",
    homepage: "https://github.com/AlvinTLC/blaze-aid-venezuela",
    repo: "https://github.com/AlvinTLC/blaze-aid-venezuela",
    hasApi: true,
    apiKind: "openapi",
    handlesPII: true,
    plane: "pii-gated",
    status: "beta",
    federated: false,
    lastVerified: "2026-06-27",
    notes:
      "Partner-hub con ingestión propia: se cataloga, no se consume. busca-vzla = registro neutral, no silo competidor.",
  },
  chamosvenezuela: {
    id: "chamosvenezuela",
    name: "Chamosvenezuela.org",
    description: "Base de datos cruzada para niños y niñas desaparecidos.",
    area: "personas",
    homepage: "https://www.chamosvenezuela.org/",
    hasApi: false,
    apiKind: "none",
    handlesPII: true,
    plane: "pii-gated",
    status: "beta",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "Maneja PII de MENORES: máxima protección. EXCLUIDO del buscador. Solo enlace.",
  },
  escaner_de_cara: {
    id: "escaner_de_cara",
    name: "Escáner de cara",
    description:
      "Idea de reconocimiento facial para comparar fotos subidas por familias con rostros documentados por rescatistas.",
    area: "personas",
    hasApi: false,
    apiKind: "none",
    handlesPII: true,
    plane: "pii-gated",
    status: "idea",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "Datos biométricos: EXCLUIDO del buscador. En fase conceptual.",
  },

  // --- Reconciliación: plataformas grandes ya en lib/links.ts (no llenaron el form) ---
  desaparecidos_terremoto_ve: {
    id: "desaparecidos_terremoto_ve",
    name: "Desaparecidos Terremoto Venezuela",
    description:
      "Plataforma ciudadana de reporte y búsqueda. La de mayor volumen de registros según la prensa (~40.000).",
    area: "personas",
    homepage: "https://desaparecidosterremotovenezuela.com/",
    hasApi: false,
    apiKind: "none",
    handlesPII: true,
    plane: "pii-gated",
    status: "live",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "No llenó el formulario. Solo enlace (también listada en /personas).",
  },
  venezuela_te_busca: {
    id: "venezuela_te_busca",
    name: "Venezuela Te Busca",
    description:
      "Registro ciudadano de desaparecidos (nombre, edad, foto y última ubicación) con búsqueda y filtros (~26.000).",
    area: "personas",
    homepage: "https://venezuelatebusca.com/",
    hasApi: false,
    apiKind: "none",
    handlesPII: true,
    plane: "pii-gated",
    status: "live",
    federated: false,
    lastVerified: "2026-06-27",
    notes: "No llenó el formulario. Solo enlace (también listada en /personas).",
  },
};

/** Estados que cuentan como "conectados" en el HUB (excluye idea/solo-directorio). */
const CONNECTED: PartnerStatus[] = ["live", "beta", "prototype"];

export function publicPartners(): Partner[] {
  return Object.values(partners);
}
export function federatedPartners(): Partner[] {
  return publicPartners().filter((p) => p.federated);
}
export function piiPartners(): Partner[] {
  return publicPartners().filter((p) => p.handlesPII);
}
export function countConnected(): number {
  return publicPartners().filter((p) => CONNECTED.includes(p.status)).length;
}
export function countWithApi(): number {
  return publicPartners().filter((p) => p.hasApi).length;
}
export function filterPartners(opts: { area?: PartnerArea; apiOnly?: boolean }): Partner[] {
  return publicPartners().filter(
    (p) => (!opts.area || p.area === opts.area) && (!opts.apiOnly || p.hasApi)
  );
}
