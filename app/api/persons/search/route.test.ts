import { vi, describe, it, expect, afterEach } from "vitest";
import { NextRequest } from "next/server";

const req = (q: string) =>
  new NextRequest(`http://localhost/api/persons/search?q=${encodeURIComponent(q)}`);

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("GET /api/persons/search — fail-closed", () => {
  it("503 cuando el proxy está APAGADO (default)", async () => {
    vi.resetModules();
    const { GET } = await import("./route");
    const res = await GET(req("jose perez"));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("intake_gated");
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
  });

  it("400 ante consulta solo-cédula (anti-oráculo) con el proxy encendido", async () => {
    vi.stubEnv("PERSON_SEARCH_PROXY", "on");
    vi.resetModules();
    const { GET } = await import("./route");
    const res = await GET(req("V-12345678"));
    expect(res.status).toBe(400);
  });

  it("400 ante consulta demasiado corta", async () => {
    vi.stubEnv("PERSON_SEARCH_PROXY", "on");
    vi.resetModules();
    const { GET } = await import("./route");
    const res = await GET(req("jo"));
    expect(res.status).toBe(400);
  });

  it("200 con nombre válido: consulta a los finders elegibles", async () => {
    vi.stubEnv("PERSON_SEARCH_PROXY", "on");
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ items: [] }) })));
    vi.resetModules();
    const { GET } = await import("./route");
    const res = await GET(req("jose perez"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.queried).toContain("encuentralos");
    expect(res.headers.get("cache-control")).toBe("no-store");
  });
});
