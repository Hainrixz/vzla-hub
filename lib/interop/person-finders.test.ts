import { vi, describe, it, expect, afterEach } from "vitest";
import {
  federatedPersonSearch,
  personLinkOuts,
  ageBucket,
  toStatus,
  safeName,
} from "./person-finders";

afterEach(() => vi.unstubAllGlobals());

describe("ageBucket", () => {
  it("0 o negativo → undefined (desconocida)", () => {
    expect(ageBucket(0)).toBeUndefined();
    expect(ageBucket(-3)).toBeUndefined();
  });
  it("mapea a rangos PFIF", () => {
    expect(ageBucket(3)).toBe("0-5");
    expect(ageBucket(10)).toBe("6-12");
    expect(ageBucket(15)).toBe("13-17");
    expect(ageBucket(25)).toBe("18-30");
    expect(ageBucket(40)).toBe("31-45");
    expect(ageBucket(55)).toBe("46-60");
    expect(ageBucket(80)).toBe("60+");
  });
  it("nunca expone la edad exacta", () => {
    expect(ageBucket(61)).not.toContain("61");
  });
});

describe("toStatus", () => {
  it("encontrado/vivo → believed_alive", () => {
    expect(toStatus("encontrado")).toBe("believed_alive");
    expect(toStatus("a salvo")).toBe("believed_alive");
  });
  it("desaparecido → believed_missing", () => expect(toStatus("desaparecido")).toBe("believed_missing"));
  it("fallecido → believed_dead", () => expect(toStatus("fallecido")).toBe("believed_dead"));
  it("desconocido → undefined", () => expect(toStatus("xyz")).toBeUndefined());
});

describe("safeName", () => {
  it("descarta nombre con PII embebida", () => {
    expect(safeName("Juan Pérez CI V-12345678")).toBeUndefined();
    expect(safeName("Maria 0414-1234567")).toBeUndefined();
  });
  it("conserva nombre limpio y capa a 80 chars", () => {
    expect(safeName("Juan Pérez")).toBe("Juan Pérez");
    expect(safeName("x".repeat(200))?.length).toBe(80);
  });
});

describe("personLinkOuts", () => {
  it("solo plataformas de personas con enlace", () => {
    const outs = personLinkOuts();
    expect(outs.length).toBeGreaterThan(0);
    expect(outs.every((o) => typeof o.url === "string" && o.url.startsWith("http"))).toBe(true);
  });
  it("excluye ids dados", () => {
    const outs = personLinkOuts(["venezuela_te_busca"]);
    expect(outs.find((o) => /Te Busca/.test(o.name))).toBeUndefined();
  });
});

describe("federatedPersonSearch (encuentralos elegible)", () => {
  it("consulta el finder y mapea SOLO campos seguros (descarta PII cruda)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          items: [
            { nombre: "Maria Perez", edad: 30, estado: "desaparecido", cedula: "V-12345678", reporta_contacto: "0414-1234567", descripcion: "Playa Grande calle 7" },
          ],
        }),
      }))
    );
    const r = await federatedPersonSearch({ name: "maria" });
    expect(r.queried).toContain("encuentralos");
    expect(r.responded).toContain("encuentralos");
    expect(r.matches).toHaveLength(1);
    const m = r.matches[0];
    expect(m.displayName).toBe("Maria Perez");
    expect(m.ageRange).toBe("18-30");
    expect(m.status).toBe("believed_missing");
    // Nada de cédula/teléfono/dirección en el resultado
    const blob = JSON.stringify(m);
    expect(blob).not.toContain("12345678");
    expect(blob).not.toContain("0414");
    expect(blob).not.toContain("Playa Grande");
  });

  it("declara siempre las plataformas no federadas (busca también aquí)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ items: [] }) })));
    const r = await federatedPersonSearch({ name: "jose perez" });
    expect(Array.isArray(r.nonFederated)).toBe(true);
    expect(r.nonFederated.length).toBeGreaterThan(0);
  });
});
