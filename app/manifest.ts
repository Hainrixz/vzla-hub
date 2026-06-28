import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "busca-vzla — HUB de ayuda (sismo Venezuela 2026)",
    short_name: "busca-vzla",
    description:
      "Buscar personas, donar, ayudar y encontrar recursos tras el sismo en Venezuela, en un solo lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "es",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
