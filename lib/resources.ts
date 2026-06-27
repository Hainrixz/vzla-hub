/*
  Guías de seguridad post-sismo. Información general de prevención; ante una
  emergencia real, prioriza siempre a los organismos oficiales. Cada bloque se
  muestra en un acordeón nativo (<details>) que funciona sin JavaScript y offline.
*/

export type Guia = {
  titulo: string;
  puntos: string[];
};

export const guias: Guia[] = [
  {
    titulo: "Réplicas: qué hacer",
    puntos: [
      "Tras un sismo fuerte habrá réplicas. Pueden ocurrir durante días o semanas.",
      "Si sientes un temblor: agáchate, cúbrete y agárrate. Aléjate de ventanas y objetos que puedan caer.",
      "Si estás en un edificio dañado, sal con calma cuando deje de temblar; usa escaleras, no ascensores.",
      "Identifica un punto de encuentro con tu familia por si se separan.",
    ],
  },
  {
    titulo: "Gas, electricidad y estructura",
    puntos: [
      "Si hueles gas, no enciendas luces ni fósforos; cierra la llave y ventila.",
      "Si ves cables caídos o chispas, corta la electricidad desde el tablero si puedes hacerlo con seguridad.",
      "No entres a edificaciones con grietas grandes, columnas dañadas o que se inclinen.",
    ],
  },
  {
    titulo: "Agua potable e higiene",
    puntos: [
      "Si no estás seguro de la calidad del agua, hiérvela 1 minuto (3 a alturas elevadas) antes de beberla.",
      "Alternativa: 2 gotas de cloro sin aroma por litro, esperar 30 minutos.",
      "Lávate las manos con frecuencia; en un albergue el riesgo de enfermedades aumenta.",
    ],
  },
  {
    titulo: "Primeros auxilios básicos",
    puntos: [
      "Hemorragia: presiona directamente la herida con un paño limpio.",
      "No muevas a una persona con posible lesión de columna salvo peligro inminente.",
      "Mantén abrigada a la persona en shock; busca atención médica cuanto antes.",
    ],
  },
  {
    titulo: "Salud mental y contención",
    puntos: [
      "El miedo, el insomnio y la ansiedad son reacciones normales ante un desastre.",
      "Habla con alguien de confianza; mantén rutinas simples y descanso cuando puedas.",
      "Limita la sobreexposición a noticias e imágenes fuertes, especialmente en niños.",
    ],
  },
];
