import { vi, describe, it, expect, afterEach } from "vitest";
import { NextRequest } from "next/server";

// getItems hace red real: lo mockeamos para aislar la lógica del endpoint.
vi.mock("@/lib/agg/aggregate", () => ({
  getItems: vi.fn(async () => ({ items: [], meta: { total: 0 } })),
}));

const post = (body: Record<string, unknown>) =>
  new NextRequest("http://localhost/api/search", { method: "POST", body: JSON.stringify(body) });
const personasJson = vi.fn(async () => ({
  ok: true,
  json: async () => ({ items: [{ nombre: "Maria Perez", edad: 25, estado: "desaparecido", cedula: "V-12345678" }] }),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("POST /api/search", () => {
  it("con el buscador APAGADO: persons.gated true, sin matches", async () => {
    vi.resetModules();
    const { POST } = await import("./route");
    const body = await (await POST(post({ q: "maria perez" }))).json();
    expect(body.persons.gated).toBe(true);
    expect(body.persons.matches).toEqual([]);
  });

  it("fail-closed: una palabra suelta ('agua') NO dispara personas aunque esté ON", async () => {
    vi.stubEnv("PERSON_SEARCH_PROXY", "on");
    vi.stubGlobal("fetch", personasJson);
    vi.resetModules();
    const { POST } = await import("./route");
    const body = await (await POST(post({ q: "agua" }))).json();
    expect(body.persons.wanted).toBe(false);
    expect(body.persons.matches).toEqual([]);
  });

  it("un nombre de ≥2 palabras SÍ dispara personas (ON), sin PII cruda", async () => {
    vi.stubEnv("PERSON_SEARCH_PROXY", "on");
    vi.stubGlobal("fetch", personasJson);
    vi.resetModules();
    const { POST } = await import("./route");
    const body = await (await POST(post({ q: "maria perez" }))).json();
    expect(body.persons.gated).toBe(false);
    expect(body.persons.matches.length).toBeGreaterThan(0);
    expect(JSON.stringify(body.persons.matches)).not.toContain("12345678");
  });

  it("intención explícita kind=person fuerza la búsqueda con un solo token", async () => {
    vi.stubEnv("PERSON_SEARCH_PROXY", "on");
    vi.stubGlobal("fetch", personasJson);
    vi.resetModules();
    const { POST } = await import("./route");
    const body = await (await POST(post({ q: "luz", kind: "person" }))).json();
    expect(body.persons.wanted).toBe(true);
  });

  it("solo-cédula no dispara personas (anti-oráculo)", async () => {
    vi.stubEnv("PERSON_SEARCH_PROXY", "on");
    vi.stubGlobal("fetch", personasJson);
    vi.resetModules();
    const { POST } = await import("./route");
    const body = await (await POST(post({ q: "V-12345678", kind: "person" }))).json();
    expect(body.persons.matches).toEqual([]);
  });
});
