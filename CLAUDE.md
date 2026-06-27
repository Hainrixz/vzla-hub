# busca-vzla — guía para Claude Code

HUB consolidador + app para buscar/reportar personas desaparecidas tras el sismo en Venezuela (2026).
Maneja **PII de víctimas de desastre**: privacidad y corrección son seguridad de vida.
Plan completo: `~/.claude/plans/la-idea-detr-s-de-fluffy-nygaard.md`.

## Comandos
- `npm run dev` — servidor de desarrollo (Turbopack)
- `npm run build` — build de producción
- `npm run lint` — ESLint

## Stack
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · lucide-react.
Por construir (Fase 1+): Supabase Pro (Postgres+PostGIS+Auth+RLS) · Cloudflare R2 (fotos+PMTiles) ·
Serwist (PWA) · MapLibre · Upstash (rate-limit) · Resend · moderación OpenAI/Sightengine.

## Arquitectura (resumida)
- App Router. Server Components por defecto; `"use client"` solo donde haga falta (ej. ShareButton).
- Diseño: estilo "Accessible & Ethical". Tokens en `app/globals.css` (`@theme`): paleta navy/blue,
  colores de status, banner anti-estafa. Fuentes Lexend (display) + Source Sans 3 (body) vía next/font.
- `lib/links.ts` — datos del HUB de enlace cruzado (solo URLs verificadas).
- `components/` — UI (EnlaceCard, ScamBanner, ShareButton).

## Reglas no negociables
1. **El cliente NUNCA habla directo con la Data API de Supabase.** Tablas base en schema `app`
   privado (no expuesto); todo acceso a datos pasa por route handlers de Next.js tras middleware
   (Turnstile + rate-limit). El anon key solo para la sesión de auth.
2. **Privacidad base, no fase 2:** RLS en cada tabla; coords precisas nunca salen al cliente
   (solo centroide de parroquia); EXIF se borra server-side; el borrado borra de verdad (R2 + purge CDN);
   reveal-contact es fail-closed y exige magic-link.
3. **Moderación antes de público:** las fotos van a bucket privado, pasan moderación server-side y
   solo entonces se marcan `aprobada`. Nunca auto-aprobar si el proveedor cae.
4. **No fragmentar la búsqueda:** enlace cruzado a las plataformas existentes; export PFIF cuando
   haya consumidor; **nunca auto-merge** de duplicados.
5. **Gate `REAL_DATA_INTAKE`:** no se aceptan datos reales de víctimas hasta que pasen todos los
   gates de seguridad + estén publicados privacy policy/ToS + haya moderadores con SLA.

## HUB de crisis (rutas y política)
HUB mobile-first de 5 pilares con barra inferior fija (`components/BottomDock.tsx`). Rutas:
`/` (router de intención) · `/personas` (enlaces a plataformas existentes) · `/donar` (+`/donar/como-verificamos`) ·
`/ayudar` · `/sismo` · `/recursos` · `/mapa` (stub) · `/fuentes` · `/legal`.
- Shell global en `app/layout.tsx` (AppBar + ScamBanner + BottomDock + SiteFooter). Datos en `lib/{nav,donations,emergency,resources,links}.ts`.
- **Donaciones = solo enlace.** Nunca recaudar/procesar dinero, sin formularios de pago, sin campañas de usuarios, sin reimprimir cuentas/Zelle/cripto. Cada enlace lleva `lastVerified` y se auto-oculta si caduca (`donacionesVigentes`).
- **Ninguna ruta ship-now captura PII** ni muestra coords precisas. El mapa muestra zonas, no personas, hasta que el núcleo seguro pase el gate `REAL_DATA_INTAKE`.
- No publicar cifras propias (muertos, etc.): atribuir a la fuente oficial (USGS/GDACS/ReliefWeb) con enlace.
- Acordeones con `<details>` nativo (sin JS, offline). Componentes mobile-first probados a 360/390/430px.

## Motor de agregación + API pública (`lib/agg/` + `/api/v1`)
"Agregar fuentes confiables", no "scrapear todo". La API es el producto; el hub la consume (via `getItems`).
- `lib/agg/types.ts` (AggItem), `lib/agg/sources.ts` (registro por fuente con compuertas), `lib/agg/normalize.ts` (canonicalizeUrl, sha256, dedupe), `lib/agg/adapters/*` (usgs/gdacs live; reliefweb gated por `RELIEFWEB_APPNAME`), `lib/agg/aggregate.ts` (`getItems`).
- API: `GET /api/v1/items` (filtros type/source/lat/lng/radiusKm/limit/offset, máx 200, bloque de procedencia + meta), `GET /api/v1/sources`. Caché CDN (s-maxage + SWR).
- **Reglas de agregación responsable (duras):**
  - **Feeds/APIs oficiales primero.** Scraping de HTML = excepción por fuente (allowlist, robots+ToS, sin login). **PII de víctimas: nunca scrapear** (personas solo vía PFIF/acuerdo).
  - **Atribuir, no aseverar:** cada item lleva procedencia (fuente, fecha, método, licencia, tier) + enlace de origen; **nunca cifras propias** (muertos, etc.). Solo titular + extracto corto + enlace; nunca el texto completo de algo con copyright.
  - **Dos planos separados:** `agg` (público, sin PII) jamás se mezcla con `app` (PII). La API abierta sirve solo datos no-PII.
  - Una fuente nueva exige una entrada en el registro (`sources.ts`) con sus compuertas; si falta una, no se ingiere.
- Ingesta durable (Cloudflare Workers + Cron + Queues) y el schema `agg` en Supabase: pendientes (necesitan credenciales). v1 actual = fetch+caché en SSR/route handlers.

## Estilo de código
- a11y: targets ≥44px, focus visible, `prefers-reduced-motion`, alt text, labels en formularios.
- Íconos SVG (lucide-react), nunca emojis como íconos. Color nunca es el único indicador de estado.
- Copy en español. Externalizar strings (next-intl) cuando se añada i18n.
