import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { fetchUsgs } from "./usgs";
import { fetchGdacs } from "./gdacs";
import { fetchVenezuelaSolidaria } from "./venezuela-solidaria";
import { fetchPuenteVe } from "./puente-ve";

const fetchMock = vi.fn();
const AT = "2026-06-28T00:00:00.000Z";

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

const okJson = (data: unknown) => ({ ok: true, json: async () => data });
const okText = (text: string) => ({ ok: true, text: async () => text });

describe("fetchUsgs", () => {
  it("mapea features dentro del bbox a official_alert y filtra fuera", async () => {
    fetchMock.mockResolvedValue(
      okJson({
        features: [
          {
            id: "a",
            properties: { mag: 6.1, place: "Venezuela", time: 1782000000000, url: "https://usgs.gov/eq/a", title: "M 6.1 - Venezuela", alert: "orange", tsunami: 0 },
            geometry: { coordinates: [-66.9, 10.5, 12] },
          },
          {
            id: "b",
            properties: { mag: 5, place: "Japan", time: 1782000000000, url: "https://usgs.gov/eq/b", title: "M 5.0 - Japan", alert: null, tsunami: 0 },
            geometry: { coordinates: [140, 35, 10] },
          },
        ],
      })
    );
    const items = await fetchUsgs(AT);
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe("official_alert");
    expect(items[0].geo).toEqual({ lat: 10.5, lng: -66.9 });
    expect(items[0].extra?.magnitude).toBe(6.1);
    expect(items[0].trustTier).toBe(1);
  });

  it("devuelve [] si la respuesta no es ok", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    expect(await fetchUsgs(AT)).toEqual([]);
  });
});

describe("fetchGdacs", () => {
  it("parsea RSS a official_alert", async () => {
    fetchMock.mockResolvedValue(
      okText(
        `<?xml version="1.0"?><rss><channel><item><title>Earthquake M6 Venezuela</title><link>https://gdacs.org/report/123</link><description>Magnitude 6 quake</description><pubDate>Wed, 24 Jun 2026 22:00:00 GMT</pubDate></item></channel></rss>`
      )
    );
    const items = await fetchGdacs(AT);
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe("official_alert");
    expect(items[0].title).toBe("Earthquake M6 Venezuela");
  });
});

describe("fetchVenezuelaSolidaria", () => {
  it("mapea categorías y aplica el guard anti-PII", async () => {
    fetchMock.mockResolvedValue(
      okJson({
        items: [
          { title: "Fondo X", url: "https://x.org", category: "donaciones", description: "Apóyanos" },
          { title: "Albergue Y", url: "https://y.org", category: "emergencia", description: "Refugio activo" },
          { title: "Z", url: "https://z.org", category: "paginas", description: "contacto V-12345678" },
        ],
      })
    );
    const items = await fetchVenezuelaSolidaria(AT);
    expect(items).toHaveLength(2); // el tercero (cédula) se descarta
    const donac = items.find((i) => i.title === "Fondo X")!;
    expect(donac.type).toBe("donation_appeal");
    expect(donac.summary).toBeNull(); // donation_appeal = solo enlace
    const recurso = items.find((i) => i.title === "Albergue Y")!;
    expect(recurso.type).toBe("resource");
    expect(recurso.summary).toBe("Refugio activo");
    expect(items.every((i) => i.provenance.method === "partner")).toBe(true);
  });

  it("devuelve [] ante JSON inesperado", async () => {
    fetchMock.mockResolvedValue(okJson({ nope: true }));
    expect(await fetchVenezuelaSolidaria(AT)).toEqual([]);
  });
});

describe("fetchPuenteVe", () => {
  it("está env-gated: sin PUENTE_VE_URL/KEY devuelve [] y no llama a fetch", async () => {
    const items = await fetchPuenteVe(AT);
    expect(items).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
