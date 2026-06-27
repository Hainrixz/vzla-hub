"use client";

import { Share2 } from "lucide-react";

/**
 * Compartir el HUB. Usa la Web Share API nativa si existe (móviles);
 * si no, cae a WhatsApp (wa.me) que es el canal dominante del público objetivo.
 */
export function ShareButton({
  url,
  texto,
}: {
  url: string;
  texto: string;
}) {
  async function compartir() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "busca-vzla", text: texto, url });
        return;
      } catch {
        // usuario canceló: no hacemos nada
        return;
      }
    }
    const wa = `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`;
    window.open(wa, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={compartir}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:bg-[var(--color-background)] cursor-pointer"
    >
      <Share2 className="size-4" aria-hidden="true" />
      Compartir
    </button>
  );
}
