import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal — busca-vzla",
  description:
    "Aviso legal de busca-vzla: no es un canal oficial, nunca pedimos dinero, y cómo solicitar la retirada de datos.",
};

export default function LegalPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Aviso legal
      </h1>

      <div className="mt-4 space-y-6 text-[var(--color-secondary)]">
        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">No es un canal oficial</h2>
          <p className="mt-2 text-sm">
            busca-vzla es una herramienta comunitaria de ayuda. No es un organismo
            del Estado y no reemplaza a Protección Civil, CICPC, Bomberos ni a la
            Cruz Roja. Para emergencias, usa los números oficiales (911 / 171).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Nunca pedimos dinero</h2>
          <p className="mt-2 text-sm">
            No recaudamos, procesamos ni recibimos donaciones. En la sección Donar
            solo enlazamos a organizaciones reconocidas en su sitio oficial. Nunca
            te pediremos datos de pago.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Privacidad y retirada de datos</h2>
          <p className="mt-2 text-sm">
            Cuando se active el reporte de personas, se podrá solicitar la retirada
            o corrección de cualquier dato sin necesidad de iniciar sesión, en
            ejercicio del derecho de hábeas data. Minimizamos los datos: no pedimos
            datos médicos ni de identificación.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Responsabilidad de la información</h2>
          <p className="mt-2 text-sm">
            La información de terceros (plataformas, organizaciones, fuentes) se
            ofrece como referencia. Verifica siempre en la fuente oficial antes de
            actuar, donar o desplazarte.
          </p>
        </section>
      </div>
    </main>
  );
}
