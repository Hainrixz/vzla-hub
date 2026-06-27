/*
  Números y canales de emergencia. Solo incluimos números ampliamente conocidos
  con enlace de llamada directa (tel:). Para los canales cuyo número exacto
  conviene confirmar, se listan como referencia, no como llamada, para no difundir
  un número equivocado.
*/

export type Emergencia = {
  nombre: string;
  descripcion: string;
  /** Número para tel: (solo si es ampliamente conocido y verificado). */
  telefono?: string;
};

export const emergencias: Emergencia[] = [
  {
    nombre: "VEN 911",
    descripcion: "Sistema integrado de emergencias. Llama para una emergencia en curso.",
    telefono: "911",
  },
  {
    nombre: "Emergencias 171",
    descripcion: "Número de emergencia tradicional (policía / atención inmediata).",
    telefono: "171",
  },
  {
    nombre: "Protección Civil",
    descripcion: "Gestión de emergencias y desastres. Confirma el número de tu localidad.",
  },
  {
    nombre: "Bomberos",
    descripcion: "Rescate e incendios. Marca el número local de tu municipio.",
  },
  {
    nombre: "CICPC",
    descripcion: "Denuncia formal de persona desaparecida (registro legal).",
  },
  {
    nombre: "Cruz Roja Venezolana",
    descripcion: "Atención prehospitalaria y reunificación familiar.",
  },
];
