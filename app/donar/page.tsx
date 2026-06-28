import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { DonationCard } from "@/components/DonationCard";
import { AggItemCard } from "@/components/AggItemCard";
import { InfoAccordion } from "@/components/InfoAccordion";
import { Section } from "@/components/Section";
import { getItems } from "@/lib/agg/aggregate";
import {
  donacionesVigentes,
  TIER_LABEL,
  type Tier,
} from "@/lib/donations";

// ISR: refresca los llamamientos agregados de la comunidad cada 5 min.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Donar — busca-vzla",
  description:
    "Directorio verificado de organizaciones reconocidas para donar a la respuesta del sismo en Venezuela. busca-vzla no recauda dinero: solo enlazamos a sitios oficiales.",
};

const TIER_ORDER: Tier[] = ["oficial", "ong", "agregador"];

function fechaCorta(iso: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso + "T00:00:00Z"));
}

export default async function DonarPage() {
  const vigentes = donacionesVigentes(new Date());
  const { items: comunidad } = await getItems({ type: "donation_appeal", limit: 12 });

  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Donar de forma segura
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Enlazamos solo a organizaciones reconocidas, en su sitio oficial. El dinero
        suele ayudar más rápido que los bienes. Desconfía de cualquiera que te
        apure o te pida pagar por vías que no se pueden recuperar.
      </p>

      {/* Disclaimer duro */}
      <div
        role="note"
        className="mt-4 flex gap-3 rounded-[var(--radius)] border-l-4 border-[var(--color-danger)] bg-[var(--color-danger-bg)] p-4"
      >
        <ShieldCheck className="size-5 shrink-0 text-[var(--color-danger)]" aria-hidden="true" />
        <p className="text-sm text-[var(--color-danger)]">
          <strong>busca-vzla NO recauda dinero</strong>, no procesa pagos y no recibe
          fondos. Solo te llevamos al sitio oficial de cada organización. Nunca te
          pediremos datos de pago.
        </p>
      </div>

      {/* Verifica antes de donar */}
      <div className="mt-4">
        <InfoAccordion titulo="Verifica antes de donar (checklist)">
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>Busca el nombre de la organización + “estafa” u “opinión”.</li>
            <li>Cuidado con nombres copiados o campañas “surgidas de la noche a la mañana”.</li>
            <li>Exige que digan en qué se gasta tu dinero.</li>
            <li>Paga con tarjeta (tiene protección); <strong>nunca</strong> por transferencia, gift card o cripto.</li>
            <li>Confirma cualquier cuenta o número <strong>solo</strong> en el sitio oficial.</li>
            <li>Reporta fraudes a las autoridades de protección al consumidor.</li>
          </ul>
          <Link
            href="/donar/como-verificamos"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            Cómo verificamos y cómo vetar un recaudador
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </InfoAccordion>
      </div>

      {/* Tiers */}
      <div className="mt-8">
        {TIER_ORDER.map((tier) => {
          const items = vigentes.filter((d) => d.tier === tier);
          if (items.length === 0) return null;
          return (
            <Section key={tier} id={tier} titulo={TIER_LABEL[tier]}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {items.map((d) => (
                  <DonationCard
                    key={d.nombre}
                    d={d}
                    verificadoTexto={`verificado ${fechaCorta(d.lastVerified)}`}
                  />
                ))}
              </ul>
            </Section>
          );
        })}
      </div>

      {comunidad.length > 0 && (
        <Section
          id="comunidad"
          titulo="Llamamientos de la comunidad"
          descripcion="Agregados de plataformas aliadas (atribuido, no verificado por nosotros). Confirma siempre el destino en el sitio oficial antes de donar."
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
