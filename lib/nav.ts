import {
  Home,
  Users,
  HandCoins,
  HeartHandshake,
  Activity,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Pestañas del dock inferior fijo (móvil, máx. 5, prioridad life-safety).
 * "Ayudar" sale del dock (queda en el router de la home y en el AppBar);
 * entra "Apps" (el directorio) que es la identidad del pivote.
 */
export const dockNav: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/donar", label: "Donar", icon: HandCoins },
  { href: "/sismo", label: "Sismo", icon: Activity },
  { href: "/aplicaciones", label: "Apps", icon: LayoutGrid },
];

/** Navegación completa del AppBar (desktop). */
export const headerNav: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/donar", label: "Donar", icon: HandCoins },
  { href: "/ayudar", label: "Ayudar", icon: HeartHandshake },
  { href: "/sismo", label: "Sismo", icon: Activity },
  { href: "/aplicaciones", label: "Aplicaciones", icon: LayoutGrid },
];
