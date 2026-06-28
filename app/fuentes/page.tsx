import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fuentes y verificación — busca-vzla",
  description:
    "Cómo verificamos los enlaces y datos del HUB, con qué frecuencia, y la lista de fuentes.",
};

// Tier 1: fuentes oficiales/autoritativas (verified).
const oficiales: string[] = [
  "IFRC / Cruz Roja — llamamiento de emergencia (ifrc.org)",
  "ONU Crisis Relief / OCHA (crisisrelief.un.org, reliefweb.int)",
  "USGS — terremotos y mapa de intensidad (earthquake.usgs.gov)",
  "GDACS — alertas globales de desastres (gdacs.org)",
];

// Tier 2: partners comunitarios (atribuido, no verificado por nosotros).
const partners: string[] = [
  "Venezuela Solidaria — recursos y donaciones (api.venezuelasolidaria.com)",
  "Puente VE — señales de zona anonimizadas (puente-ve)",
];

export default function FuentesPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Fuentes y verificación
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Solo enlazamos a sitios oficiales en su propio dominio. Cada enlace de
        donación lleva una fecha de verificación y se oculta automáticamente si pasa
        demasiado tiempo sin revisarse. No publicamos datos propios sobre víctimas
        ni cifras: atribuimos todo a su fuente oficial.
      </p>

      <h2 className="mt-8 text-lg font-bold text-[var(--color-primary)]">
        Cómo verificamos
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--color-secondary)]">
        <li>Un enlace se publica solo si apunta al dominio oficial de la organización.</li>
        <li>Una segunda persona confirma el dominio contra las redes oficiales o Wikipedia.</li>
        <li>Cada entrada guarda su fecha de verificación y caduca si no se revisa.</li>
        <li>No reimprimimos números de cuenta, Zelle, Pago Móvil ni cripto.</li>
      </ul>

      <h2 className="mt-8 text-lg font-bold text-[var(--color-primary)]">
        Reportar un enlace roto o sospechoso
      </h2>
      <p className="mt-3 text-sm text-[var(--color-secondary)]">
        Estamos habilitando un canal de contacto para reportes. Mientras tanto, si
        ves algo incorrecto, no sigas el enlace y verifica directamente en el sitio
        oficial de la organización.
      </p>

      <h2 className="mt-8 text-lg font-bold text-[var(--color-primary)]">
        Dos niveles de confianza
      </h2>
      <p className="mt-3 text-sm text-[var(--color-secondary)]">
        Distinguimos las fuentes oficiales de los partners comunitarios. Cada item
        de la API lleva su procedencia y su tier; nunca presentamos un dato de
        partner como verificado por nosotros.
      </p>

      <h3 className="mt-6 text-base font-semibold text-[var(--color-primary)]">
        Oficiales (tier 1 · verificado)
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-secondary)]">
        {oficiales.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h3 className="mt-6 text-base font-semibold text-[var(--color-primary)]">
        Partners comunitarios (tier 2 · atribuido, no verificado)
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-secondary)]">
        {partners.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-[var(--color-secondary)]">
        Mira todos los proyectos en el{" "}
        <Link href="/aplicaciones" className="font-medium text-[var(--color-accent)] hover:underline">
          directorio de aplicaciones
        </Link>{" "}
        y el estándar común para apps de personas en el{" "}
        <Link href="/conectar" className="font-medium text-[var(--color-accent)] hover:underline">
          esquema de interoperabilidad (PFIF)
        </Link>
        .
      </p>
    </main>
  );
}
