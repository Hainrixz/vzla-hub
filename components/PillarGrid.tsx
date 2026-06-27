import Link from "next/link";
import { Users, HandCoins, HeartHandshake, Activity, type LucideIcon } from "lucide-react";

type Intent = {
  href: string;
  titulo: string;
  detalle: string;
  icon: LucideIcon;
};

const intents: Intent[] = [
  {
    href: "/personas",
    titulo: "Buscar a alguien",
    detalle: "Busca o reporta personas desaparecidas",
    icon: Users,
  },
  {
    href: "/recursos",
    titulo: "Necesito ayuda",
    detalle: "Emergencias, albergues, agua y salud",
    icon: HeartHandshake,
  },
  {
    href: "/ayudar",
    titulo: "Quiero ayudar",
    detalle: "Donar, voluntariado y centros de acopio",
    icon: HandCoins,
  },
  {
    href: "/sismo",
    titulo: "Info del sismo",
    detalle: "Estado, zonas afectadas y réplicas",
    icon: Activity,
  },
];

/** Router de intención 2×2: lo primero que ve un usuario en pánico. */
export function PillarGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {intents.map((it) => {
        const Icon = it.icon;
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              className="flex h-full min-h-[112px] flex-col gap-2 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-background)] cursor-pointer"
            >
              <span
                className="inline-flex size-10 items-center justify-center rounded-[var(--radius)] bg-[var(--color-background)] text-[var(--color-accent)]"
                aria-hidden="true"
              >
                <Icon className="size-5" />
              </span>
              <span className="font-semibold text-[var(--color-primary)]">
                {it.titulo}
              </span>
              <span className="text-xs text-[var(--color-muted)]">{it.detalle}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
