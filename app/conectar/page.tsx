import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldCheck, GitBranch } from "lucide-react";
import { Section } from "@/components/Section";
import { StatusLine } from "@/components/StatusLine";
import { CodeBlock } from "@/components/CodeBlock";
import { ApiEndpoint } from "@/components/ApiEndpoint";
import { countConnected, countWithApi } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Conecta tu app — busca-vzla",
  description:
    "Abre las puertas de tu app de ayuda y conéctala al HUB: registra tu proyecto, consume la API pública y adopta el esquema común (PFIF).",
};

// TODO: reemplazar por la URL real del Google Form del registro de proyectos.
const FORM_URL = "https://forms.gle/REEMPLAZAR-CON-EL-FORM-REAL";
const FORM_READY = !FORM_URL.includes("REEMPLAZAR");
const API = "https://busca-vzla.org/api/v1";

export default function ConectarPage() {
  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:py-10"
    >
      <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        Abre tus puertas. Conecta tu app.
      </h1>
      <p className="mt-3 text-[var(--color-secondary)]">
        Si estás construyendo una app para ayudar tras el sismo, conéctala al HUB
        para que su información llegue a más gente. El momento es centralizar, no
        competir.
      </p>
      <div className="mt-4">
        <StatusLine connected={countConnected()} withApi={countWithApi()} />
      </div>

      <Section
        id="listar"
        titulo="1. Registra tu proyecto"
        descripcion="Te sumamos al directorio público de apps conectadas."
      >
        <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          {FORM_READY ? (
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent-fg)] transition-colors duration-200 hover:bg-[var(--color-primary)] cursor-pointer"
            >
              Abrir el formulario
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius)] border border-dashed border-[var(--color-border-strong)] px-5 py-2.5 font-semibold text-[var(--color-muted)] cursor-not-allowed"
            >
              Formulario de registro: próximamente
            </button>
          )}
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-muted)]">
            <li>Atribución: enlazamos siempre a tu fuente; tú controlas tus datos.</li>
            <li>Sin PII por scraping: las personas solo se comparten vía el esquema común y con acuerdo.</li>
            <li>Verificamos la titularidad del dominio antes de listarte (anti-suplantación).</li>
          </ul>
        </div>
      </Section>

      <Section
        id="api"
        titulo="2. Consume la API pública"
        descripcion="Datos abiertos, sin PII, con CORS habilitado y procedencia en cada item."
      >
        <div className="flex flex-col gap-3">
          <ApiEndpoint
            method="GET"
            path="/api/v1/items"
            descripcion="Items agregados (alertas, recursos, señales de zona) con procedencia y enlace de origen. Filtros: type, source, lat/lng/radiusKm, limit, offset."
          >
            <CodeBlock
              label="curl"
              code={`curl "${API}/items?type=official_alert&limit=5"\n# → { apiVersion:"v1", items:[…], meta:{ sources, sourceStatus, attribution } }`}
            />
          </ApiEndpoint>
          <ApiEndpoint
            method="GET"
            path="/api/v1/partners"
            descripcion="Directorio de proyectos conectados (metadatos, sin PII)."
          >
            <CodeBlock label="curl" code={`curl "${API}/partners"\n# → { apiVersion:"v1", partners:[…], meta }`} />
          </ApiEndpoint>
          <ApiEndpoint
            method="GET"
            path="/api/v1/sources"
            descripcion="Fuentes técnicas y sus tiers de confianza (transparencia)."
          >
            <CodeBlock label="curl" code={`curl "${API}/sources"`} />
          </ApiEndpoint>
          <ApiEndpoint
            method="GET"
            path="/api/v1/interop/schema"
            descripcion="El esquema común (PFIF) para apps de personas desaparecidas."
          >
            <CodeBlock label="curl" code={`curl "${API}/interop/schema"`} />
          </ApiEndpoint>
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
          <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
          Política de versiones: v1 es estable y aditiva. Ignora los tipos que no
          conozcas (p.ej. <code className="font-mono">zone_signal</code>); no
          rompemos campos existentes.
        </p>
      </Section>

      <Section
        id="esquema"
        titulo="3. Adopta el esquema común (personas)"
        descripcion="Para apps de desaparecidos: una estructura compartida, sin concentrar PII."
      >
        <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-secondary)]">
          <p className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <GitBranch className="size-4" aria-hidden="true" />
            PFIF (Person Finder Interchange Format)
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[var(--color-muted)]">
            <li>Edad como rango, nunca fecha de nacimiento (protege a menores).</li>
            <li>Ubicación a nivel de zona; nunca dirección o coordenadas exactas.</li>
            <li>El HUB federa la búsqueda y enlaza a tu ficha; no almacena ni fusiona PII.</li>
            <li>Encender el buscador exige acuerdo firmado y cerrar los gates de seguridad.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/fuentes" className="font-medium text-[var(--color-accent)] hover:underline">
              Cómo verificamos
            </Link>
            <Link href="/privacidad" className="font-medium text-[var(--color-accent)] hover:underline">
              Privacidad
            </Link>
            <Link href="/terminos" className="font-medium text-[var(--color-accent)] hover:underline">
              Términos de uso de la API
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
