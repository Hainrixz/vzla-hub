import { describe, it, expect } from "vitest";
import {
  partners,
  publicPartners,
  federatedPartners,
  piiPartners,
  countConnected,
  countWithApi,
  filterPartners,
} from "./partners";

describe("invariantes de seguridad de partners", () => {
  it("ningún partner con PII está federado", () => {
    expect(piiPartners().filter((p) => p.federated)).toHaveLength(0);
  });
  it("todo federado tiene sourceId y no maneja PII", () => {
    for (const p of federatedPartners()) {
      expect(p.sourceId).toBeTruthy();
      expect(p.handlesPII).toBe(false);
    }
  });
  it("un finder elegible tiene base de consentimiento (no 'none')", () => {
    for (const p of publicPartners()) {
      if (p.personSearch?.eligible) expect(p.personSearch.consent).not.toBe("none");
    }
  });
  it("menores/biométrico/salud y Supabase-crudo nunca son elegibles", () => {
    for (const id of ["chamosvenezuela", "escaner_de_cara", "unoporciento_contigo", "buscalosvzla"]) {
      expect(partners[id].personSearch?.eligible ?? false).toBe(false);
    }
  });
});

describe("helpers del directorio", () => {
  it("publicPartners incluye las 15 entradas", () => expect(publicPartners()).toHaveLength(15));
  it("countConnected y countWithApi son coherentes", () => {
    expect(countConnected()).toBeGreaterThan(0);
    expect(countWithApi()).toBeGreaterThan(0);
    expect(countWithApi()).toBeLessThanOrEqual(publicPartners().length);
  });
  it("filterPartners por área y apiOnly", () => {
    const personasApi = filterPartners({ area: "personas", apiOnly: true });
    expect(personasApi.every((p) => p.area === "personas" && p.hasApi)).toBe(true);
  });
  it("toda entrada tiene id consistente con su clave", () => {
    for (const [k, p] of Object.entries(partners)) expect(p.id).toBe(k);
  });
});
