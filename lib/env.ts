/*
  Lectura centralizada de variables de entorno y flags derivados. Un solo lugar
  para los gates: evita strings mágicos sueltos y documenta los defaults
  (todo APAGADO si falta algo). Importar desde aquí, no leer process.env directo.
*/

const trim = (v: string | undefined): string | undefined => {
  const t = v?.trim();
  return t ? t : undefined;
};

/** Buscador de personas (proxy). Apagado salvo PERSON_SEARCH_PROXY === "on". */
export const personSearchOn = process.env.PERSON_SEARCH_PROXY === "on";

/** ReliefWeb: requiere un appname aprobado (+ enabled:true en sources.ts). */
export const reliefwebAppname = trim(process.env.RELIEFWEB_APPNAME);

/** Puente VE: requiere URL + anon key juntos (+ enabled:true en sources.ts). */
const puenteUrl = trim(process.env.PUENTE_VE_URL);
const puenteKey = trim(process.env.PUENTE_VE_ANON_KEY);
export const puenteVe = puenteUrl && puenteKey ? { url: puenteUrl, key: puenteKey } : null;
