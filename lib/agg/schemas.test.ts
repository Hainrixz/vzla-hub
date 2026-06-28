import { describe, it, expect } from "vitest";
import { vsListSchema, rowsOf, pickString, pickNumber, toIso } from "./schemas";

describe("vsListSchema + rowsOf", () => {
  it("acepta la forma real { items: [...] }", () => {
    const r = vsListSchema.safeParse({ items: [{ title: "a", url: "https://a.org" }], pagination: {} });
    expect(r.success).toBe(true);
    expect(rowsOf(r.success ? r.data : null)).toHaveLength(1);
  });
  it("acepta array directo", () => {
    const r = vsListSchema.safeParse([{ title: "a" }]);
    expect(r.success).toBe(true);
  });
  it("rechaza lo que no es array de objetos", () => {
    expect(vsListSchema.safeParse({ items: "no" }).success).toBe(false);
  });
});

describe("pickString / pickNumber", () => {
  const row = { title: "T", count: "12", lat: 10.5, empty: "  " };
  it("pickString primer no vacío", () => expect(pickString(row, ["nope", "empty", "title"])).toBe("T"));
  it("pickNumber convierte string", () => expect(pickNumber(row, ["count"])).toBe(12));
  it("pickNumber lee number", () => expect(pickNumber(row, ["lat"])).toBe(10.5));
  it("sin match → null", () => expect(pickString(row, ["x"])).toBeNull());
});

describe("toIso", () => {
  it("convierte fecha válida", () => expect(toIso("2026-06-28T02:07:14.066Z", "fb")).toBe("2026-06-28T02:07:14.066Z"));
  it("fecha inválida → fallback", () => expect(toIso("no-fecha", "fb")).toBe("fb"));
  it("null → fallback", () => expect(toIso(null, "fb")).toBe("fb"));
});
