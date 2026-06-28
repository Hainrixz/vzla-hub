/*
  Rate-limit por ventana fija, EN MEMORIA. Suficiente para una sola instancia
  (dev / un solo proceso). En serverless multi-instancia NO es global: para
  producción a escala, sustituir por @upstash/ratelimit con el mismo contrato
  (URL+token en env). Mantener este como fallback de un solo nodo.
*/
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (b.count >= limit) return { ok: false, remaining: 0 };
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}
