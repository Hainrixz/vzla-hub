import {
  Home,
  Users,
  HandCoins,
  HeartHandshake,
  Activity,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Pestañas de la barra inferior fija (spine de navegación mobile-first). */
export const navItems: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/donar", label: "Donar", icon: HandCoins },
  { href: "/ayudar", label: "Ayudar", icon: HeartHandshake },
  { href: "/sismo", label: "Sismo", icon: Activity },
];
