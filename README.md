# busca-vzla

HUB consolidador + API pública para la crisis del **sismo de Venezuela (2026)**:
buscar personas, donar con seguridad, ofrecer ayuda y **conectar las apps
comunitarias** para que la información esté en un solo lugar.

> Maneja PII de víctimas de desastre. La privacidad y la corrección son seguridad
> de vida. Ver las reglas no negociables en [`CLAUDE.md`](./CLAUDE.md).

## Qué es

- **Directorio** (`/aplicaciones`): registro neutral de los proyectos de la
  comunidad. Cada uno es responsable de sus datos; aquí se reúnen.
- **API pública** (`/api/v1`): el producto. Datos agregados NO-PII con procedencia
  en cada item, CORS abierto y caché en CDN. La consume el propio hub.
- **Estándar común** (PFIF): esquema para que las apps de personas se conecten.
- **Buscador de personas**: proxy de paso **construido pero APAGADO** tras gates
  de seguridad (no almacena PII; ver más abajo).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 ·
lucide-react · zod · fast-xml-parser · vitest.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo (Turbopack)
npm run build      # build de producción
npm run validate   # typecheck + lint + tests
npm test           # solo tests (vitest)
```

## API pública (`/api/v1`)

| Endpoint | Descripción |
|---|---|
| `GET /api/v1` | Índice: lista de endpoints + enlaces legales |
| `GET /api/v1/items` | Items agregados. Filtros: `type`, `source`, `lat`/`lng`/`radiusKm`, `limit` (máx 200), `offset` |
| `GET /api/v1/sources` | Fuentes técnicas y sus tiers de confianza |
| `GET /api/v1/partners` | Directorio de proyectos conectados (sin PII) |
| `GET /api/v1/stats` | Conteos por tipo y por fuente |
| `GET /api/v1/interop/schema` | Esquema común PFIF para apps de personas |

Cada item lleva un bloque `provenance` (fuente, fecha, método, licencia, tier) y
un enlace de origen. **Atribuir, no aseverar**: nunca presentamos un dato como
verificado por nosotros si no lo es.

```bash
curl "https://busca-vzla.org/api/v1/items?type=official_alert&limit=5"
```

## Planos de datos (regla dura)

- **`agg`** (público, SIN PII): el motor `lib/agg/`. Una regla de ESLint impide que
  importe del plano `app`. Un guard anti-PII de dos capas descarta cualquier item
  con email/teléfono/cédula/datos financieros.
- **`app`** (PII): el buscador de personas vive en `lib/interop/` + `app/api/persons/`,
  **fuera** de `/api/v1`, same-origin, fail-closed. Apagado por defecto.

## Variables de entorno

Ver [`.env.example`](./.env.example). Todas son opcionales con **defaults seguros
(apagado)**:

- `PERSON_SEARCH_PROXY` — interruptor del buscador de personas (default `off`).
- `PUENTE_VE_URL` / `PUENTE_VE_ANON_KEY` — partner Puente VE (señales de zona).
- `RELIEFWEB_APPNAME` — adapter de ReliefWeb (UN OCHA).

Encender el buscador de personas exige cerrar los gates G0–G7 (legal publicado,
acuerdo firmado por partner, rate-limit real con Upstash + Turnstile, exclusión de
salud/menores/biométrico). Ver el plan del proyecto.

## Tests

`vitest` cubre el motor (`getItems` y sus invariantes de seguridad), los adapters
(con fixtures), el guard anti-PII, la normalización, los schemas, el registro de
partners y el buscador de personas.

```bash
npm test
```
