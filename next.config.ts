import type { NextConfig } from "next";

/*
  CORS solo para el plano público SIN PII (`/api/v1/*`): permite que consumidores
  externos (p. ej. Kontigo) lean la API desde el navegador.

  INVARIANTE: el buscador de personas vive FUERA de `/api/v1` (en `/api/persons/*`)
  justamente para que esta regla no pueda exponerlo cross-origin. Nunca colocar
  endpoints con PII bajo `/api/v1`.
*/
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/v1/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
