import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal — busca-vzla",
  description:
    "Aviso legal de busca-vzla: no es un canal oficial, nunca pedimos dinero, y cómo solicitar la retirada de datos.",
};

// TODO: reemplazar por un buzón real y monitoreado (gate G0 del buscador).
const CONTACT = "privacidad@busca-vzla.org";

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
            En ejercicio del derecho de hábeas data, cualquier persona puede pedir
            conocer, rectificar o suprimir su información, sin necesidad de iniciar
            sesión. Minimizamos los datos y no concentramos PII. Detalles en la{" "}
            <Link href="/privacidad" className="font-medium text-[var(--color-accent)] hover:underline">
              política de privacidad
            </Link>{" "}
            y los{" "}
            <Link href="/terminos" className="font-medium text-[var(--color-accent)] hover:underline">
              términos de la API
            </Link>
            .
          </p>
          <p className="mt-3 text-sm">
            Canal de contacto y retirada:{" "}
            <a
              href={`mailto:${CONTACT}?subject=Solicitud%20de%20retirada`}
              className="font-medium text-[var(--color-accent)] hover:underline"
            >
              {CONTACT}
            </a>
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
