import { TriangleAlert } from "lucide-react";

/**
 * Aviso anti-estafa / "no es canal oficial". Visible y de alto contraste.
 * Las plataformas de desaparecidos atraen estafadores; advertirlo es parte del
 * diseño base, no un extra.
 */
export function ScamBanner() {
  return (
    <div
      role="alert"
      className="bg-[var(--color-danger-bg)] border-b-2 border-[var(--color-danger)]"
    >
      <div className="mx-auto max-w-3xl px-4 py-3 flex gap-3 items-start">
        <TriangleAlert
          className="size-5 shrink-0 mt-0.5 text-[var(--color-danger)]"
          aria-hidden="true"
        />
        <p className="text-sm text-[var(--color-danger)]">
          <strong className="font-semibold">
            Esto no es un canal oficial del gobierno.
          </strong>{" "}
          Nunca te pediremos dinero. Desconfía de quien diga “tengo a tu familiar,
          paga”. Para una emergencia en curso, llama al{" "}
          <a href="tel:911" className="underline font-semibold whitespace-nowrap">
            911
          </a>
          .
        </p>
      </div>
    </div>
  );
}
