import { vi, describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/agg/aggregate", () => ({
  getItems: vi.fn(async () => ({ items: [], meta: { total: 0 } })),
}));

import { GET, OPTIONS } from "./route";
import { getItems } from "@/lib/agg/aggregate";

const lastFilter = () => vi.mocked(getItems).mock.calls.at(-1)?.[0] ?? {};
const get = (qs: string) => GET(new NextRequest(`http://localhost/api/v1/items?${qs}`));

beforeEach(() => vi.mocked(getItems).mockClear());

describe("GET /api/v1/items — parseo de filtros", () => {
  it("ignora un type fuera de la allowlist (missing_person no se acepta)", async () => {
    await get("type=missing_person");
    expect(lastFilter().type).toBeUndefined();
  });

  it("acepta un type válido", async () => {
    await get("type=resource");
    expect(lastFilter().type).toBe("resource");
  });

  it("parsea near con lat/lng y radio por defecto", async () => {
    await get("lat=10.4&lng=-66.9");
    expect(lastFilter().near).toEqual({ lat: 10.4, lng: -66.9, radiusKm: 300 });
  });

  it("pasa limit/offset numéricos", async () => {
    await get("limit=10&offset=5");
    expect(lastFilter().limit).toBe(10);
    expect(lastFilter().offset).toBe(5);
  });

  it("OPTIONS responde 204 (preflight)", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
  });
});
