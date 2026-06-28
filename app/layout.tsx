import type { Metadata, Viewport } from "next";
import { Lexend, Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppBar } from "@/components/AppBar";
import { BottomDock } from "@/components/BottomDock";
import { ScamBanner } from "@/components/ScamBanner";
import { SiteFooter } from "@/components/SiteFooter";

// Fuentes variables (un solo archivo cada una) — bundle mínimo para 2G.
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono para datos/código y la estética status-page (un solo archivo variable, 2G-friendly).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_DESC =
  "Punto de encuentro para buscar personas desaparecidas, donar, ayudar y encontrar recursos tras el sismo en Venezuela. Reúne plataformas y canales oficiales en un solo lugar.";

export const metadata: Metadata = {
  metadataBase: new URL("https://busca-vzla.org"),
  title: {
    default: "busca-vzla — HUB de ayuda (sismo Venezuela 2026)",
    template: "%s",
  },
  description: SITE_DESC,
  applicationName: "busca-vzla",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "busca-vzla",
    title: "busca-vzla — HUB de ayuda (sismo Venezuela 2026)",
    description: SITE_DESC,
    url: "https://busca-vzla.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "busca-vzla — HUB de ayuda (sismo Venezuela 2026)",
    description: SITE_DESC,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${lexend.variable} ${sourceSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)]">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <AppBar />
        <ScamBanner />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
        {/* Espaciador para que el contenido no quede tapado por el dock fijo en móvil */}
        <div
          aria-hidden="true"
          className="h-[68px] lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        />
        <BottomDock />
      </body>
    </html>
  );
}
