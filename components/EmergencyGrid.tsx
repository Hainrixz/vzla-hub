import { Phone, Info } from "lucide-react";
import { emergencias } from "@/lib/emergency";

/** Cuadrícula de emergencias con llamada directa (tel:) donde hay número verificado. */
export function EmergencyGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {emergencias.map((e) => (
        <li
          key={e.nombre}
          className="flex flex-col gap-2 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <div>
            <h3 className="font-semibold text-[var(--color-primary)]">{e.nombre}</h3>
            <p className="text-sm text-[var(--color-muted)]">{e.descripcion}</p>
          </div>
          {e.telefono ? (
            <a
              href={`tel:${e.telefono}`}
              className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-danger)] px-4 py-2 font-semibold text-white transition-colors duration-200 hover:brightness-110 cursor-pointer"
            >
              <Phone className="size-4" aria-hidden="true" />
              Llamar al {e.telefono}
            </a>
          ) : (
            <p className="mt-auto inline-flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <Info className="size-4 shrink-0" aria-hidden="true" />
              Confirma el número oficial de tu localidad.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
