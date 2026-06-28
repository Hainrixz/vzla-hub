import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de uso de la API — busca-vzla",
  description:
    "Términos para consumir la API pública de busca-vzla: atribución obligatoria, sin reidentificación, sin reventa.",
};

export default function TerminosPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Términos de uso de la API
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        La API pública de busca-vzla es abierta y gratuita para ayudar a centralizar
        la información de la crisis. Al usarla, aceptas estas condiciones.
      </p>

      <div className="mt-6 space-y-6 text-sm text-[var(--color-secondary)]">
        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Atribución</h2>
          <p className="mt-2">
            Conserva y muestra la procedencia de cada item (el bloque{" "}
            <code className="font-mono">provenance</code>) y enlaza a la fuente
            original. Atribuir, no aseverar: no presentes los datos como verificados
            por ti.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Uso responsable</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>No reidentifiques personas ni cruces estos datos con otros para perfilar.</li>
            <li>No revendas el acceso ni los datos.</li>
            <li>No uses la API para localizar a una persona con intención de daño.</li>
            <li>No publiques cifras propias de víctimas: atribuye a la fuente oficial.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Estabilidad y cambios</h2>
          <p className="mt-2">
            v1 es estable y evoluciona de forma aditiva. Diseña tu cliente para
            ignorar campos o tipos desconocidos. Anunciaremos cualquier deprecación
            con antelación.
          </p>
        </section>
        <p className="text-[var(--color-muted)]">
          Ver también la{" "}
          <Link href="/privacidad" className="font-medium text-[var(--color-accent)] hover:underline">
            política de privacidad
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
