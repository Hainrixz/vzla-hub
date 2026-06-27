/*
  Directorio de donaciones — SOLO ENLACE.

  busca-vzla NUNCA recauda ni procesa dinero, no incrusta formularios de pago,
  no aloja campañas de usuarios y NO reimprime números de cuenta / Zelle / Pago
  Móvil / cripto (un dígito cambiado redirige el dinero a un estafador). Solo
  enlazamos a la página OFICIAL de cada organización, en su propio dominio, donde
  ella publica y controla los datos actuales.

  Cada entrada lleva `lastVerified`. Si supera la ventana de re-verificación, se
  oculta automáticamente (ver `donacionesVigentes`).
*/

export type Tier = "oficial" | "ong" | "agregador";

export type Donacion = {
  nombre: string;
  rol: string;
  /** Enlace a la página oficial de la organización (su propio dominio). */
  url: string;
  /** Dominio mostrado al usuario como señal de confianza. */
  dominio: string;
  tier: Tier;
  /** Fecha de última verificación (ISO YYYY-MM-DD). */
  lastVerified: string;
  /** Nota para que el usuario confirme el fondo correcto en el sitio oficial. */
  nota?: string;
};

export const TIER_LABEL: Record<Tier, string> = {
  oficial: "Oficial (Cruz Roja / ONU)",
  ong: "ONG internacionales reconocidas",
  agregador: "Plataformas con verificación propia",
};

/** Ventana de re-verificación: una entrada más vieja que esto se auto-oculta. */
export const VENTANA_DIAS = 21;

export const donaciones: Donacion[] = [
  // --- Tier 1: oficial ---
  {
    nombre: "Cruz Roja / IFRC — Llamamiento de emergencia Venezuela",
    rol: "Llamamiento de la Federación Internacional (50M CHF) para asistir a 300.000 personas vía la Cruz Roja Venezolana.",
    url: "https://www.ifrc.org/",
    dominio: "ifrc.org",
    tier: "oficial",
    lastVerified: "2026-06-27",
    nota: "Busca el llamamiento 'Venezuela Earthquake' en el sitio oficial.",
  },
  {
    nombre: "ONU — Crisis Relief (OCHA)",
    rol: "Fondo de Naciones Unidas para la respuesta humanitaria en Venezuela.",
    url: "https://crisisrelief.un.org/en/donate-venezuela-crisis",
    dominio: "crisisrelief.un.org",
    tier: "oficial",
    lastVerified: "2026-06-27",
  },
  // --- Tier 2: ONG internacionales ---
  {
    nombre: "UNICEF",
    rol: "Protección y ayuda a niñez y familias afectadas.",
    url: "https://www.unicefusa.org/",
    dominio: "unicefusa.org",
    tier: "ong",
    lastVerified: "2026-06-27",
    nota: "Busca el fondo de respuesta para Venezuela en su sitio.",
  },
  {
    nombre: "International Rescue Committee (IRC)",
    rol: "Respuesta de emergencia y apoyo a desplazados.",
    url: "https://www.rescue.org/",
    dominio: "rescue.org",
    tier: "ong",
    lastVerified: "2026-06-27",
  },
  {
    nombre: "Save the Children",
    rol: "Atención a la niñez en emergencias.",
    url: "https://www.savethechildren.org/",
    dominio: "savethechildren.org",
    tier: "ong",
    lastVerified: "2026-06-27",
  },
  {
    nombre: "Direct Relief",
    rol: "Suministros médicos y de salud a zonas afectadas.",
    url: "https://www.directrelief.org/",
    dominio: "directrelief.org",
    tier: "ong",
    lastVerified: "2026-06-27",
  },
  {
    nombre: "World Central Kitchen",
    rol: "Comidas calientes para personas afectadas y rescatistas.",
    url: "https://wck.org/",
    dominio: "wck.org",
    tier: "ong",
    lastVerified: "2026-06-27",
  },
  // --- Tier 3: agregadores con verificación propia ---
  {
    nombre: "GlobalGiving",
    rol: "Fondo agregado con organizaciones locales verificadas.",
    url: "https://www.globalgiving.org/",
    dominio: "globalgiving.org",
    tier: "agregador",
    lastVerified: "2026-06-27",
    nota: "Busca el 'Venezuela Earthquake Relief Fund'. Cada organización pasa verificación de GlobalGiving.",
  },
  {
    nombre: "GoFundMe — centro verificado",
    rol: "Campañas que pasaron revisión de confianza de GoFundMe.",
    url: "https://www.gofundme.com/",
    dominio: "gofundme.com",
    tier: "agregador",
    lastVerified: "2026-06-27",
    nota: "Usa solo el centro/hub verificado de Venezuela; evita campañas individuales sin verificar.",
  },
];

/** Resta de días entre dos fechas ISO (sin usar Date.now en módulos del workflow). */
function diasDesde(iso: string, hoy: Date): number {
  const d = new Date(iso + "T00:00:00Z");
  return Math.floor((hoy.getTime() - d.getTime()) / 86_400_000);
}

/**
 * Devuelve solo las donaciones dentro de la ventana de verificación.
 * `hoy` se inyecta (server component lo pasa) para mantener el módulo puro.
 */
export function donacionesVigentes(hoy: Date): Donacion[] {
  return donaciones.filter((d) => diasDesde(d.lastVerified, hoy) <= VENTANA_DIAS);
}
