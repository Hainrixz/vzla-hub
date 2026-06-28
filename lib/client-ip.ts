/*
  IP del cliente para rate-limit. Prefiere `x-real-ip` (lo fija la plataforma y el
  cliente no lo puede falsificar a través del edge). Cae al hop MÁS A LA DERECHA de
  `x-forwarded-for` (el añadido por el proxy de confianza), NUNCA al de más a la
  izquierda (controlable por el cliente y spoofeable).
*/
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "local";
}
