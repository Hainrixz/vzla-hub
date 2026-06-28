import { vi, describe, it, expect, beforeEach } from "vitest";
import type { AggItem, ItemType, IngestMethod } from "./types";

// Mockeamos los adapters para probar el orquestador de forma determinista.
vi.mock("./adapters/usgs", () => ({ fetchUsgs: vi.fn(async () => []) }));
vi.mock("./adapters/gdacs", () => ({ fetchGdacs: vi.fn(async () => []) }));
vi.mock("./adapters/reliefweb", () => ({ fetchReliefWeb: vi.fn(async () => []) }));
vi.mock("./adapters/venezuela-solidaria", () => ({ fetchVenezuelaSolidaria: vi.fn(async () => []) }));
vi.mock("./adapters/puente-ve", () => ({ fetchPuenteVe: vi.fn(async () => []) }));

import { getItems } from "./aggregate";
import { fetchUsgs } from "./adapters/usgs";
import { fetchGdacs } from "./adapters/gdacs";
import { fetchVenezuelaSolidaria } from "./adapters/venezuela-solidaria";

let n = 0;
function mk(type: ItemType, method: IngestMethod, over: Partial<AggItem> = {}): AggItem {
  n += 1;
  const url = `https://x.org/${n}`;
  const title = over.title ?? `item ${n}`;
  return {
    id: `id-${n}`,
    type,
    title,
    summary: null,
    url,
    lang: "es",
    geo: null,
    publishedAt: `2026-06-${String((n % 28) + 1).padStart(2, "0")}T00:00:00Z`,
    trustTier: method === "partner" ? 2 : 1,
    verificationStatus: "unverified",
    provenance: {
      source: method === "partner" ? "venezuela_solidaria" : "usgs",
      sourceName: "S",
      sourceUrl: url,
      fetchedAt: "x",
      method,
      license: "l",
      trustTier: method === "partner" ? 2 : 1,
      contentHash: `hash-${n}`,
    },
    ...over,
  };
}

beforeEach(() => {
  vi.mocked(fetchUsgs).mockResolvedValue([]);
  vi.mocked(fetchGdacs).mockResolvedValue([]);
  vi.mocked(fetchVenezuelaSolidaria).mockResolvedValue([]);
});

describe("getItems — invariantes de seguridad", () => {
  it("descarta missing_person y items de partner con PII", async () => {
    vi.mocked(fetchUsgs).mockResolvedValue([
      mk("official_alert", "feed", { title: "M5 sismo" }),
      mk("missing_person", "feed", { title: "no debería salir" }),
    ]);
    vi.mocked(fetchVenezuelaSolidaria).mockResolvedValue([
      mk("resource", "partner", { title: "Albergue limpio" }),
      mk("donation_appeal", "partner", { title: "Dona V-12345678" }), // PII → drop
    ]);

    const { items, meta } = await getItems({ limit: 50 });
    const types = items.map((i) => i.type);
    expect(types).not.toContain("missing_person");
    expect(items.find((i) => i.title === "Dona V-12345678")).toBeUndefined();
    expect(items.find((i) => i.title === "Albergue limpio")).toBeTruthy();
    expect(items.find((i) => i.title === "M5 sismo")).toBeTruthy();
    expect(meta.dropped).toBeGreaterThanOrEqual(2);
  });
});

describe("getItems — filtros y paginación", () => {
  it("pagina con limit/offset y reporta total", async () => {
    vi.mocked(fetchUsgs).mockResolvedValue(
      Array.from({ length: 5 }, () => mk("official_alert", "feed"))
    );
    const { items, meta } = await getItems({ limit: 2, offset: 1 });
    expect(items).toHaveLength(2);
    expect(meta.total).toBe(5);
    expect(meta.limit).toBe(2);
    expect(meta.offset).toBe(1);
  });

  it("filtra por type", async () => {
    vi.mocked(fetchUsgs).mockResolvedValue([mk("official_alert", "feed")]);
    vi.mocked(fetchVenezuelaSolidaria).mockResolvedValue([mk("resource", "partner")]);
    const { items } = await getItems({ type: "resource" });
    expect(items.every((i) => i.type === "resource")).toBe(true);
    expect(items).toHaveLength(1);
  });

  it("ordena por publishedAt descendente", async () => {
    const a = mk("official_alert", "feed", { publishedAt: "2026-06-01T00:00:00Z" });
    const b = mk("official_alert", "feed", { publishedAt: "2026-06-20T00:00:00Z" });
    vi.mocked(fetchUsgs).mockResolvedValue([a, b]);
    const { items } = await getItems();
    expect(items[0].publishedAt > items[1].publishedAt).toBe(true);
  });
});

describe("getItems — observabilidad de fuentes", () => {
  it("marca sourceStatus.ok=false cuando un adapter falla", async () => {
    vi.mocked(fetchGdacs).mockRejectedValue(new Error("boom"));
    const { meta } = await getItems();
    expect(meta.sourceStatus.gdacs.ok).toBe(false);
    expect(meta.sourceStatus.usgs.ok).toBe(true);
  });
});
