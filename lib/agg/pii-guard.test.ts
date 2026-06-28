import { describe, it, expect } from "vitest";
import { scanPii, sanitizePartnerItem, stripPrecision } from "./pii-guard";
import type { AggItem } from "./types";

const base = (over: Partial<AggItem>): AggItem => ({
  id: "x",
  type: "resource",
  title: "t",
  summary: null,
  url: "https://e.org",
  lang: "es",
  geo: null,
  publishedAt: "2026-06-28T00:00:00Z",
  trustTier: 2,
  verificationStatus: "unverified",
  provenance: {
    source: "s",
    sourceName: "S",
    sourceUrl: "https://e.org",
    fetchedAt: "x",
    method: "partner",
    license: "l",
    trustTier: 2,
    contentHash: "h",
  },
  ...over,
});

describe("scanPii", () => {
  it("detecta email", () => expect(scanPii("escribe a juan@gmail.com")).toContain("email"));
  it("detecta Pago Móvil/teléfono", () => expect(scanPii("Pago Móvil 0414-1234567")).toContain("phone"));
  it("detecta teléfono fijo VE (02xx)", () => expect(scanPii("llama al 0212-5551234")).toContain("phone"));
  it("detecta teléfono entre paréntesis", () => expect(scanPii("contáctanos (0414) 123-4567")).toContain("phone"));
  it("detecta cédula con prefijo", () => expect(scanPii("cédula V-12345678")).toContain("cedula"));
  it("detecta cédula etiquetada con puntos", () => expect(scanPii("C.I: 12.345.678")).toContain("cedula"));
  it("detecta cuenta de 20 dígitos", () => expect(scanPii("cuenta 01020304050607080910")).toContain("account"));
  it("detecta cuenta con separadores", () => expect(scanPii("0102 0304 05 0607080910")).toContain("account"));
  it("detecta wallet ETH (checksum)", () =>
    expect(scanPii("envía a 0x52908400098527886E0F7030069857D2E4169EE7")).toContain("crypto"));
  it("detecta wallet TRON (TRC20)", () =>
    expect(scanPii("USDT TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC")).toContain("crypto"));
  it("texto limpio no dispara", () => expect(scanPii("Centro de acopio en Chacao, ropa y agua")).toHaveLength(0));
  it("no confunde fechas/horarios con cuenta", () =>
    expect(scanPii("Abierto de 8 a 5, sábados de 9 a 1")).toHaveLength(0));
});

describe("sanitizePartnerItem: url y extra", () => {
  it("descarta item con mailto en url", () =>
    expect(sanitizePartnerItem(base({ url: "mailto:ayuda@x.org" }))).toBeNull());
  it("permite link-out de WhatsApp (wa.me)", () =>
    expect(sanitizePartnerItem(base({ url: "https://wa.me/584121234567" }))).not.toBeNull());
  it("descarta PII embebida en valores numéricos de extra", () =>
    expect(sanitizePartnerItem(base({ extra: { contacto: 4121234567 } }))).toBeNull());
});

describe("sanitizePartnerItem", () => {
  it("descarta item con cédula en summary", () =>
    expect(sanitizePartnerItem(base({ summary: "contacto V-12345678" }))).toBeNull());
  it("descarta item con email en título", () =>
    expect(sanitizePartnerItem(base({ title: "escribe a x@y.com" }))).toBeNull());
  it("conserva item limpio", () =>
    expect(sanitizePartnerItem(base({ title: "Albergue", summary: "Refugio temporal" }))).not.toBeNull());
  it("recorta geo a centroide (~0.1)", () => {
    const r = sanitizePartnerItem(base({ title: "Zona", geo: { lat: 10.488765, lng: -66.879432 } }));
    expect(r?.geo).toEqual({ lat: 10.5, lng: -66.9 });
  });
});

describe("stripPrecision", () => {
  it("null → null", () => expect(stripPrecision(null)).toBeNull());
  it("redondea a 1 decimal por defecto", () =>
    expect(stripPrecision({ lat: 10.488, lng: -66.879 })).toEqual({ lat: 10.5, lng: -66.9 }));
});
