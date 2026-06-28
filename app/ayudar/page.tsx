import type { Metadata } from "next";
import Link from "next/link";
import { HandCoins, Droplet, Users, Package, ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";
import { AggItemCard } from "@/components/AggItemCard";
import { getItems } from "@/lib/agg/aggregate";

// ISR: refresca los recursos agregados de la comunidad cada 5 min.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cómo ayudar — busca-vzla",
  description:
    "Formas de ayudar tras el sismo en Venezuela: donar dinero a organizaciones verificadas, donar sangre, voluntariado y centros de acopio.",
};

const formas: { icon: typeof HandCoins; titulo: string; texto: string }[] = [
  {
    icon: Droplet,
    titulo: "Donar sangre",
    texto:
      "Acude a un banco de sangre u hospital. Confirma horarios y requisitos con el centro de salud de tu zona antes de ir.",
  },
  {
    icon: Users,
    titulo: "Voluntariado",
    texto:
      "Coordina siempre a través de una organización reconocida (Cruz Roja, Protección Civil u ONG establecidas). No vayas por tu cuenta a zonas de riesgo.",
  },
  {
    icon: Package,
    titulo: "Centros de acopio",
    texto:
      "Antes de llevar insumos, confirma qué se necesita y dónde con tu alcaldía o Protección Civil. Distingue entre puntos oficiales y comunitarios.",
  },
];

export default async function AyudarPage() {
  const { items: comunidad } = await getItems({ type: "resource", limit: 12 });
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Cómo ayudar
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        El dinero a organizaciones que ya están en terreno suele ser la ayuda más
        rápida y útil. Si quieres aportar de otra forma, hazlo siempre a través de
        canales reconocidos.
      </p>

      {/* Donar dinero — CTA principal */}
      <Link
        href="/donar"
        className="mt-5 flex items-center gap-4 rounded-[var(--radius)] border border-[var(--color-accent)] bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
      >
        <span
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--color-accent)] text-white"
          aria-hidden="true"
        >
          <HandCoins className="size-6" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-[var(--color-primary)]">
            Donar dinero a organizaciones verificadas
          </span>
          <span className="block text-sm text-[var(--color-muted)]">
            Directorio solo-enlace, con checklist anti-estafa
          </span>
        </span>
        <ArrowRight className="size-5 text-[var(--color-accent)]" aria-hidden="true" />
      </Link>

      <Section id="otras-formas" titulo="Otras formas de ayudar">
        <ul className="grid gap-4 sm:grid-cols-2">
          {formas.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.titulo}
                className="flex flex-col gap-2 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <span
                  className="inline-flex size-10 items-center justify-center rounded-[var(--radius)] bg-[var(--color-background)] text-[var(--color-accent)]"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="font-semibold text-[var(--color-primary)]">{f.titulo}</h3>
                <p className="text-sm text-[var(--color-muted)]">{f.texto}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {comunidad.length > 0 && (
        <Section
          id="comunidad"
          titulo="Recursos de la comunidad"
          descripcion="Agregados de plataformas aliadas (atribuido, no verificado por nosotros). Verifica en la fuente antes de actuar."
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {comunidad.map((it) => (
              <AggItemCard key={it.id} item={it} />
            ))}
          </ul>
        </Section>
      )}
    </main>
  );
}
