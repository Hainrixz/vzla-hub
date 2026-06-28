import type { MetadataRoute } from "next";

/*
  El buscador de personas (`/api/persons/*`) y las APIs en general no se indexan.
  Las páginas públicas (directorio, conectar, etc.) sí.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/persons", "/api/"],
    },
    sitemap: "https://busca-vzla.org/sitemap.xml",
  };
}
