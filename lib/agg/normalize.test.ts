import { describe, it, expect } from "vitest";
import { canonicalizeUrl, contentHash, recordId, dedupe, haversineKm } from "./normalize";
import type { AggItem } from "./types";

describe("canonicalizeUrl", () => {
  it("quita utm_/fbclid/gclid/ref y el fragmento", () => {
    expect(canonicalizeUrl("https://x.org/a?utm_source=tw&id=5&fbclid=abc#frag")).toBe("https://x.org/a?id=5");
  });
  it("normaliza www", () => {
    expect(canonicalizeUrl("https://www.x.org/a")).toBe("https://x.org/a");
  });
  it("entrada inválida → trim", () => {
    expect(canonicalizeUrl("  no-es-url  ")).toBe("no-es-url");
  });
});

describe("contentHash", () => {
  it("es estable y normaliza mayúsculas/URL", () => {
    expect(contentHash("Hola", "https://www.x.org/a#f")).toBe(contentHash("hola", "https://x.org/a"));
  });
  it("recordId usa el namespace propio", () => {
    expect(recordId("abcdef0123456789")).toBe("buscavzla.org/i.abcdef012345");
  });
});

const item = (over: Partial<AggItem>): AggItem => ({
  id: "x", type: "news", title: "t", summary: null, url: "https://x.org",
  lang: "es", geo: null, publishedAt: "2026-06-01T00:00:00Z", trustTier: 3,
  verificationStatus: "unverified",
  provenance: { source: "s", sourceName: "S", sourceUrl: "https://x.org", fetchedAt: "x", method: "feed", license: "l", trustTier: 3, contentHash: "same" },
  ...over,
});

describe("dedupe", () => {
  it("conserva el de mayor confianza (tier menor) ante igual hash", () => {
    const a = item({ id: "a", trustTier: 3, provenance: { ...item({}).provenance, trustTier: 3, contentHash: "same" } });
    const b = item({ id: "b", trustTier: 1, provenance: { ...item({}).provenance, trustTier: 1, contentHash: "same" } });
    const out = dedupe([a, b]);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("b");
  });
});

describe("haversineKm", () => {
  it("distancia cero consigo mismo", () => {
    expect(haversineKm({ lat: 10, lng: -66 }, { lat: 10, lng: -66 })).toBeCloseTo(0, 5);
  });
  it("~111km por grado de latitud", () => {
    expect(haversineKm({ lat: 10, lng: -66 }, { lat: 11, lng: -66 })).toBeGreaterThan(110);
  });
});
