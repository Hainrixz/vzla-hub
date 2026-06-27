import Link from "next/link";
import { Users, Phone, ShieldAlert, ArrowRight } from "lucide-react";
import { PillarGrid } from "@/components/PillarGrid";
import { InfoAccordion } from "@/components/InfoAccordion";
import { Section } from "@/components/Section";
import { ShareButton } from "@/components/ShareButton";

const SITE_URL = "https://busca-vzla.org";
const SHARE_TEXT =
  "Ayuda y búsqueda tras el sismo en Venezuela: buscar personas, donar y recursos de emergencia en un solo lugar.";

export default function Home() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      {/* Hero */}
      <section className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
          <ShieldAlert className="size-3.5 text-[var(--color-status-desaparecido)]" aria-hidden="true" />
          Pueden ocurrir réplicas — mantente alerta
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-[var(--color-primary)] sm:text-3xl">
          Ayuda y búsqueda tras el sismo en Venezuela
        </h1>
        <p className="mt-3 text-[var(--color-secondary)]">
          Un solo lugar para buscar a quienes faltan, donar con seguridad,
          ofrecer ayuda y encontrar recursos de emergencia. Reunimos las
          plataformas y los canales oficiales para que no tengas que revisar cada
          uno por separado.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/personas"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
          >
            <Users className="size-5" aria-hidden="true" />
            Buscar a alguien
          </Link>
          <ShareButton url={SITE_URL} texto={SHARE_TEXT} />
        </div>
      </section>

      {/* Router de intención */}
      <Section id="acciones" titulo="¿Qué necesitas hacer?">
        <PillarGrid />
      </Section>

      {/* Emergencias compacto */}
      <Section
        id="emergencias"
        titulo="Emergencias"
        descripcion="Si hay vidas en riesgo ahora, llama de inmediato."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="tel:911"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-danger)] px-4 py-2 font-semibold text-white transition-colors duration-200 hover:brightness-110 cursor-pointer"
          >
            <Phone className="size-5" aria-hidden="true" />
            Llamar al 911
          </a>
          <a
            href="tel:171"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--color-danger)] px-4 py-2 font-semibold text-[var(--color-danger)] transition-colors duration-200 hover:bg-[var(--color-danger-bg)] cursor-pointer"
          >
            <Phone className="size-5" aria-hidden="true" />
            Llamar al 171
          </a>
        </div>
        <Link
          href="/recursos"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
        >
          Ver guías de seguridad y más números
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      {/* Anti-estafa */}
      <Section id="cuidado" titulo="Cuídate de las estafas">
        <InfoAccordion titulo="Cómo reconocer un fraude tras el sismo" defaultOpen>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>Nadie legítimo te dirá “tengo a tu familiar, paga para liberarlo”.</li>
            <li>
              Desconfía de quien pide dinero por transferencia, gift card o cripto.
              Esos pagos no se pueden recuperar.
            </li>
            <li>
              Verifica cualquier cuenta o número <strong>solo</strong> en el sitio
              oficial de la organización, no en mensajes reenviados.
            </li>
            <li>
              busca-vzla nunca te pedirá datos de pago ni recauda dinero: solo
              enlazamos a organizaciones reconocidas.
            </li>
          </ul>
        </InfoAccordion>
      </Section>
    </main>
  );
}
