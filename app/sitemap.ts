import type { MetadataRoute } from "next";

const BASE = "https://busca-vzla.org";

/** Rutas públicas indexables. */
export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    "",
    "/personas",
    "/donar",
    "/donar/como-verificamos",
    "/ayudar",
    "/sismo",
    "/recursos",
    "/aplicaciones",
    "/conectar",
    "/fuentes",
    "/legal",
    "/privacidad",
    "/terminos",
  ];
  return rutas.map((r) => ({
    url: `${BASE}${r}`,
    changeFrequency: "daily" as const,
    priority: r === "" ? 1 : 0.7,
  }));
}
