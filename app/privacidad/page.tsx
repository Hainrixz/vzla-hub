import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacidad — busca-vzla",
  description:
    "Política de privacidad: qué datos tratamos, el buscador de personas, hábeas data y cómo pedir la retirada de información.",
};

// TODO: reemplazar por un buzón real y monitoreado antes de encender el buscador (gate G0).
const CONTACT = "privacidad@busca-vzla.org";

export default function PrivacidadPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Privacidad
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        busca-vzla minimiza datos por diseño. El plano público (directorio y API)
        no contiene datos personales (PII). Esta política explica cómo tratamos la
        información y cómo ejercer tus derechos.
      </p>

      <div className="mt-6 space-y-6 text-sm text-[var(--color-secondary)]">
        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Lo que NO hacemos</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>No recaudamos dinero ni pedimos datos de pago.</li>
            <li>No publicamos cédulas, teléfonos, datos de salud ni ubicaciones exactas.</li>
            <li>No fusionamos datos de personas entre plataformas (sin perfilado cruzado).</li>
            <li>No vendemos ni cedemos datos a terceros.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">El buscador de personas</h2>
          <p className="mt-2">
            Cuando se active, el buscador <strong>no almacena</strong> información de
            víctimas: reenvía tu consulta a las plataformas aliadas (con acuerdo) y
            te devuelve un enlace a la ficha en su sitio, con datos mínimos (nombre
            mostrado y estado). La fuente sigue siendo responsable del dato. Hoy el
            buscador está en construcción y desactivado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">
            Hábeas data y retirada de información
          </h2>
          <p className="mt-2">
            En ejercicio del derecho de hábeas data (Art. 28 de la Constitución),
            cualquier persona puede pedir conocer, rectificar o suprimir su
            información. Como no almacenamos PII, ejecutamos la retirada bloqueando
            ese registro en el buscador y escalando la solicitud a la plataforma de
            origen para su eliminación.
          </p>
          <p className="mt-3 inline-flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
            <a
              href={`mailto:${CONTACT}?subject=Solicitud%20de%20retirada%20(h%C3%A1beas%20data)`}
              className="font-medium text-[var(--color-accent)] hover:underline"
            >
              {CONTACT}
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">Menores</h2>
          <p className="mt-2">
            Las plataformas que manejan datos de niñas y niños reciben protección
            reforzada y quedan excluidas del buscador unificado: solo se enlazan.
          </p>
        </section>

        <p className="text-[var(--color-muted)]">
          Ver también el{" "}
          <Link href="/legal" className="font-medium text-[var(--color-accent)] hover:underline">
            aviso legal
          </Link>{" "}
          y los{" "}
          <Link href="/terminos" className="font-medium text-[var(--color-accent)] hover:underline">
            términos de uso de la API
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
