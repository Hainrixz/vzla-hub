import { CircleDot, CircleDashed, Circle } from "lucide-react";
import { partnerStatusMeta, type PartnerStatus } from "@/lib/partners";

const ICONS: Record<PartnerStatus, typeof Circle> = {
  live: CircleDot,
  beta: CircleDashed,
  prototype: CircleDashed,
  idea: Circle,
  "directory-only": Circle,
};

/** Estado de un partner: punto de color + ÍCONO + TEXTO (nunca solo color). */
export function PartnerStatusBadge({ status }: { status: PartnerStatus }) {
  const meta = partnerStatusMeta[status];
  const Icon = ICONS[status];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-xs font-medium text-[var(--color-secondary)]">
      <Icon
        className="size-3.5"
        style={{ color: `var(${meta.token})` }}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}
