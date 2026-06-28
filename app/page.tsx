import type { Metadata } from "next";
import { HubChat } from "@/components/HubChat";

export const metadata: Metadata = {
  title: "busca-vzla — encuentra ayuda tras el sismo en Venezuela",
  description:
    "Busca a una persona, agua, un refugio o dónde donar. Toda la información de la crisis del sismo en Venezuela, en un solo lugar y fácil de usar.",
};

export default function Home() {
  return (
    <main id="contenido" className="mx-auto w-full max-w-2xl px-4">
      <HubChat />
    </main>
  );
}
