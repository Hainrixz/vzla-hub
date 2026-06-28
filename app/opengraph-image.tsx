import { ImageResponse } from "next/og";

export const alt = "busca-vzla — HUB de ayuda tras el sismo en Venezuela (2026)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f172a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#38bdf8", fontSize: 30 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, background: "#38bdf8", display: "flex" }} />
          HUB de ayuda · sismo Venezuela 2026
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 28, lineHeight: 1.05, display: "flex" }}>
          Toda la ayuda del sismo, en un solo lugar
        </div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#cbd5e1", display: "flex", maxWidth: 900 }}>
          Buscar personas, donar, ayudar y conectar las apps de la comunidad.
        </div>
        <div style={{ fontSize: 30, marginTop: 48, color: "#94a3b8", display: "flex" }}>
          busca-vzla.org
        </div>
      </div>
    ),
    { ...size }
  );
}
