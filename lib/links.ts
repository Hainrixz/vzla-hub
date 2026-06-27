/*
  Datos del HUB de enlace cruzado.

  busca-vzla NO opera ninguna de estas plataformas. El objetivo (restricción #4:
  "no fragmentar la búsqueda") es que una familia encuentre desde un solo lugar
  TODAS las plataformas y canales donde buscar, en vez de revisar cada una por
  separado.

  Regla: solo se incluye `url` cuando está verificada. Los canales cuyo enlace
  oficial aún no se ha confirmado quedan como `url: undefined` y se muestran como
  referencia, no como enlace, para no mandar a la gente a un sitio equivocado.
*/

export type Enlace = {
  nombre: string;
  descripcion: string;
  url?: string;
  /** Dato de tracción aproximado (reportes), si se conoce. */
  reportes?: string;
  /** Para canales oficiales: teléfono de emergencia. */
  telefono?: string;
};

/** Plataformas ciudadanas de búsqueda (no oficiales). */
export const plataformas: Enlace[] = [
  {
    nombre: "Desaparecidos Terremoto Venezuela",
    descripcion:
      "Plataforma ciudadana de reporte y búsqueda. Es la de mayor volumen de registros reportado por la prensa.",
    url: "https://desaparecidosterremotovenezuela.com/",
    reportes: "~40.000 reportes",
  },
  {
    nombre: "Venezuela Te Busca",
    descripcion:
      "Registro ciudadano de personas desaparecidas: nombre, edad, foto y última ubicación, con búsqueda y filtros.",
    url: "https://venezuelatebusca.com/",
    reportes: "~26.000 reportes",
  },
  {
    nombre: "Buscador — Red de Periodistas Venezolanas",
    descripcion:
      "Iniciativa periodística de verificación y búsqueda. Confirma el enlace oficial antes de compartirlo.",
    reportes: "~500 reportes",
  },
];

/** Canales oficiales / institucionales. */
export const canalesOficiales: Enlace[] = [
  {
    nombre: "VEN 911",
    descripcion:
      "Sistema integrado de emergencias. Para una emergencia en curso, llama al 911.",
    telefono: "911",
  },
  {
    nombre: "Protección Civil",
    descripcion:
      "Organismo oficial de gestión de emergencias y desastres. Confirma sus canales locales.",
  },
  {
    nombre: "CICPC — Registro de personas desaparecidas",
    descripcion:
      "Cuerpo de Investigaciones: registro legal de personas desaparecidas. La denuncia formal se hace aquí.",
  },
  {
    nombre: "Cruz Roja Venezolana / CICR — Restablecimiento del Contacto Familiar",
    descripcion:
      "Servicio de búsqueda y reunificación familiar del Movimiento de la Cruz Roja (privado y gestionado).",
    url: "https://familylinks.icrc.org/organization/venezuelan-red-cross",
  },
];
