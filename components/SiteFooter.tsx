import Link from "next/link";
import { Heart } from "lucide-react";
import { StatusLine } from "@/components/StatusLine";
import { countConnected, countWithApi } from "@/lib/partners";

type Col = { titulo: string; links: { href: string; label: string }[] };

const COLS: Col[] = [
  {
    titulo: "Buscar",
    links: [
      { href: "/personas", label: "Personas" },
      { href: "/aplicaciones", label: "Aplicaciones" },
      { href: "/sismo", label: "Sismo" },
    ],
  },
  {
    titulo: "Ayudar",
    links: [
      { href: "/donar", label: "Donar" },
      { href: "/ayudar", label: "Ofrecer ayuda" },
      { href: "/recursos", label: "Recursos" },
    ],
  },
  {
    titulo: "Proyecto",
    links: [
      { href: "/conectar", label: "Conecta tu app" },
      { href: "/fuentes", label: "Fuentes y verificación" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { href: "/legal", label: "Aviso legal" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "/terminos", label: "Términos de la API" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 text-sm lg:max-w-5xl">
        <nav
          aria-label="Mapa del sitio"
          className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4"
        >
          {COLS.map((col) => (
            <div key={col.titulo} className="flex flex-col gap-2">
              <h2 className="font-display text-sm font-bold text-[var(--color-primary)]">
                {col.titulo}
              </h2>
              <ul className="flex flex-col gap-1.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:underline cursor-pointer"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-[var(--color-muted)]">
          <StatusLine connected={countConnected()} withApi={countWithApi()} />
          <p className="inline-flex items-center gap-2">
            <Heart className="size-4 text-[var(--color-accent)]" aria-hidden="true" />
            Herramienta comunitaria. No es un canal oficial y no reemplaza a
            Protección Civil, CICPC ni a la Cruz Roja.
          </p>
          <p>
            busca-vzla nunca recauda dinero ni pide datos de pago. Trata con cuidado
            y respeto la información de las personas afectadas.
          </p>
        </div>
      </div>
    </footer>
  );
}
