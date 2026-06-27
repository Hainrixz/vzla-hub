import type { Metadata } from "next";
import { EmergencyGrid } from "@/components/EmergencyGrid";
import { InfoAccordion } from "@/components/InfoAccordion";
import { Section } from "@/components/Section";
import { guias } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Recursos y emergencias — busca-vzla",
  description:
    "Números de emergencia, guías de seguridad ante réplicas, agua potable, primeros auxilios y salud mental tras el sismo en Venezuela.",
};

export default function RecursosPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Recursos y emergencias
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Qué hacer ahora y a quién llamar. Información general de prevención; ante
        una emergencia real, prioriza siempre a los organismos oficiales.
      </p>

      <Section
        id="emergencias"
        titulo="A quién llamar"
        descripcion="Llamada directa donde el número está verificado."
      >
        <EmergencyGrid />
      </Section>

      <Section
        id="guias"
        titulo="Guías de seguridad"
        descripcion="Funciona sin conexión una vez que abres la app."
      >
        <div className="flex flex-col gap-3">
          {guias.map((g, i) => (
            <InfoAccordion key={g.titulo} titulo={g.titulo} defaultOpen={i === 0}>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {g.puntos.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </InfoAccordion>
          ))}
        </div>
      </Section>
    </main>
  );
}
