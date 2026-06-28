import type { AggItem, GeoPoint } from "./types";

/*
  Guard anti-PII, fail-closed. Segunda capa de defensa: el adapter solo copia
  campos de una allowlist (pickString), y aquí se descarta cualquier item cuyo
  texto contenga PII o datos financieros (cuentas, Zelle, Pago Móvil, cripto).

  El plano público `agg` jamás transita datos personales ni reimprime
  instrucciones de pago (regla "donaciones = solo enlace").
*/

const PATTERNS: { label: string; re: RegExp }[] = [
  { label: "email", re: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i },
  // Móvil VE (+58 / 04xx) y fijo VE (02xx).
  { label: "phone", re: /(?:\+?58[\s.-]?)?0?4\d{2}[\s.-]?\d{3}[\s.-]?\d{4}\b/ },
  { label: "phone", re: /\b0?2\d{2}[\s.-]?\d{3}[\s.-]?\d{4}\b/ },
  // Cédula/RIF con prefijo, o etiquetada (cédula/CI ... dígitos).
  { label: "cedula", re: /\b[VEJGP]-?\d{6,9}\b/i },
  { label: "cedula", re: /\bc(?:[ée]dula|\.?\s*i\.?)\b[\s:]*v?-?\d[\d.\s]{5,}/i },
  // Cuenta / IBAN (20 dígitos).
  { label: "account", re: /\b\d{20}\b/ },
  // Wallets cripto: ETH (checksum), BTC legacy/bech32, TRON (TRC20, dominante en VE).
  { label: "crypto", re: /\b(?:0x[a-fA-F0-9]{40}|bc1[a-z0-9]{20,}|T[1-9A-HJ-NP-Za-km-z]{33}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/ },
];

/*
  Colapsa separadores ENTRE dígitos (12.345.678 → 12345678; (0414) 123-4567 →
  04141234567; cuenta con espacios). Edge conocido y aceptado (fail-closed): cinco
  grupos de 4 dígitos separados por un espacio (p.ej. una lista de 5 años) colapsan
  a 20 dígitos y disparan `account`. Preferimos descartar de más que filtrar PII.
*/
function collapseDigits(s: string): string {
  return s.replace(/(\d)[\s.()\-]+(?=\d)/g, "$1");
}

/** Enlaces de mensajería son link-outs legítimos (no PII de víctima reimpresa). */
function scrubLinkOuts(url: string): string {
  return /^https?:\/\/(?:wa\.me|t\.me|api\.whatsapp\.com|m\.me)\//i.test(url) ? "" : url;
}

/** Devuelve las categorías de PII/financiero detectadas en un texto. */
export function scanPii(text: string): string[] {
  const variants = [text, collapseDigits(text)];
  const found = new Set<string>();
  for (const v of variants) for (const { label, re } of PATTERNS) if (re.test(v)) found.add(label);
  return [...found];
}

/**
 * Recorta la precisión de un punto a nivel de zona (centroide). Por defecto 1
 * decimal (~11 km). Un `geo` ligado a una persona nunca debe ser más fino.
 */
export function stripPrecision(geo: GeoPoint, minDecimals = 1): GeoPoint {
  if (!geo) return null;
  const f = 10 ** minDecimals;
  return {
    lat: Math.round(geo.lat * f) / f,
    lng: Math.round(geo.lng * f) / f,
  };
}

/**
 * Sanea un item de partner antes de publicarlo. Escanea título, resumen, valores
 * de `extra` y el `url` (salvo enlaces de mensajería). Si detecta PII/financiero,
 * devuelve `null` (se descarta). Si no, recorta la precisión geográfica.
 */
export function sanitizePartnerItem(item: AggItem): AggItem | null {
  const extra = item.extra
    ? Object.values(item.extra)
        .filter((v): v is string | number => v != null)
        .map(String)
        .join(" ")
    : "";
  const text = `${item.title} ${item.summary ?? ""} ${extra} ${scrubLinkOuts(item.url)}`;
  if (scanPii(text).length > 0) return null;
  return { ...item, geo: stripPrecision(item.geo) };
}
