import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuentes y verificación — busca-vzla",
  description:
    "Cómo verificamos los enlaces y datos del HUB, con qué frecuencia, y la lista de fuentes.",
};

const fuentes: string[] = [
  "IFRC / Cruz Roja — llamamiento de emergencia (ifrc.org)",
  "ONU Crisis Relief / OCHA (crisisrelief.un.org, reliefweb.int)",
  "USGS — terremotos y mapa de intensidad (earthquake.usgs.gov)",
  "GDACS — alertas globales de desastres (gdacs.org)",
  "Plataformas ciudadanas de búsqueda referenciadas en la sección Personas",
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
        Lista de fuentes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-secondary)]">
        {fuentes.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </main>
  );
}
