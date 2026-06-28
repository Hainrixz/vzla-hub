"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dockNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Barra de navegación inferior fija (spine mobile-first). Pulgar-alcanzable.
 * Se oculta en lg: donde un navbar superior toma el relevo.
 */
export function BottomDock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around">
        {dockNav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer",
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                )}
              >
                <Icon
                  className="size-6"
                  strokeWidth={active ? 2.4 : 1.8}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 h-1 w-6 rounded-full",
                    active ? "bg-[var(--color-accent)]" : "bg-transparent"
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
