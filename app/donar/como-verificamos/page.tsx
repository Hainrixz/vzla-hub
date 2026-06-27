import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo verificamos — busca-vzla",
  description:
    "Metodología de verificación de las organizaciones del directorio de donaciones y recursos para vetar un recaudador.",
};

const herramientas: { nombre: string; url: string; dominio: string; nota: string }[] = [
  { nombre: "Charity Navigator", url: "https://www.charitynavigator.org/", dominio: "charitynavigator.org", nota: "Calificaciones de transparencia y finanzas de ONG." },
  { nombre: "BBB Wise Giving Alliance", url: "https://give.org/", dominio: "give.org", nota: "Estándares de rendición de cuentas de organizaciones benéficas." },
  { nombre: "CharityWatch", url: "https://www.charitywatch.org/", dominio: "charitywatch.org", nota: "Evaluación independiente de eficiencia del gasto." },
  { nombre: "ReliefWeb (OCHA)", url: "https://reliefweb.int/disaster/eq-2026-000093-ven", dominio: "reliefweb.int", nota: "Quiénes están respondiendo oficialmente en terreno." },
];

export default function ComoVerificamosPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Cómo verificamos
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Cada organización del directorio se enlaza únicamente a su sitio oficial,
        en su propio dominio. Antes de publicar un enlace, una segunda persona
        confirma el dominio contra las redes oficiales o la página de Wikipedia de
        la organización, para evitar dominios falsos parecidos. Cada tarjeta lleva
        la fecha de última verificación y se oculta automáticamente si pasa
        demasiado tiempo sin revisarse.
      </p>

      <h2 className="mt-8 text-lg font-bold text-[var(--color-primary)]">
        Verifica tú mismo
      </h2>
      <p className="mt-1 mb-4 text-sm text-[var(--color-muted)]">
        Herramientas independientes para confirmar cualquier organización antes de donar.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {herramientas.map((h) => (
          <li
            key={h.nombre}
            className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <div>
              <h3 className="font-semibold text-[var(--color-primary)]">{h.nombre}</h3>
              <p className="text-sm text-[var(--color-muted)]">{h.nota}</p>
            </div>
            <a
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius)] border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
            >
              Abrir {h.dominio}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
