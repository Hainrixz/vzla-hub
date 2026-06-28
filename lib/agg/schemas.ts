import { z } from "zod";

/*
  Validación de payloads de terceros en el borde del adapter. Los objetos se
  modelan como registros laxos a propósito: el adapter SOLO lee campos de una
  allowlist (`pickString`/`pickNumber`) y nunca copia claves desconocidas al
  AggItem, así que un campo PII inesperado (cédula, teléfono) jamás llega al
  plano público. La segunda capa (`sanitizePartnerItem`) descarta cualquier item
  cuyo texto contenga PII/financiero.
*/

export const looseObject = z.record(z.string(), z.unknown());

/** Respuesta de Venezuela Solidaria: array directo o envuelto. */
export const vsListSchema = z.union([
  z.array(looseObject),
  z.object({ data: z.array(looseObject) }),
  z.object({ resources: z.array(looseObject) }),
  z.object({ items: z.array(looseObject) }),
]);

/** Filas de las RPC anonimizadas de Puente VE. */
export const puenteRowsSchema = z.union([
  z.array(looseObject),
  z.object({ data: z.array(looseObject) }),
]);

export type LooseRow = Record<string, unknown>;

/** Devuelve las filas como array, sea cual sea la envoltura. */
export function rowsOf(parsed: unknown): LooseRow[] {
  if (Array.isArray(parsed)) return parsed as LooseRow[];
  if (parsed && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>;
    for (const k of ["data", "resources", "items"]) {
      if (Array.isArray(o[k])) return o[k] as LooseRow[];
    }
  }
  return [];
}

/** Primer valor string no vacío entre una lista de claves candidatas. */
export function pickString(row: LooseRow, keys: string[]): string | null {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Primer valor numérico finito entre una lista de claves candidatas. */
export function pickNumber(row: LooseRow, keys: string[]): number | null {
  for (const k of keys) {
    const v = row[k];
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** Convierte un valor de fecha a ISO; si no es válido, usa el fallback. */
export function toIso(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d.toISOString() : fallback;
}
