# `lib/agg` — plano de datos público (SIN PII)

Este directorio es el **plano `agg`**: el motor de agregación que alimenta la API
pública (`/api/v1/items`, `/sources`, `/partners`) y al hub. **Solo datos NO-PII.**

## Reglas (no negociables)

1. **`lib/agg` NUNCA importa de `@/app/*`** (el plano `app` maneja PII). Esta
   frontera la verifica ESLint (`no-restricted-imports` en `eslint.config.mjs`);
   no es una convención.
2. **Ningún adapter habilitado puede emitir PII** ni items `type: "missing_person"`.
   Cada item de partner pasa por `sanitizePartnerItem` (`pii-guard.ts`), que
   descarta lo que contenga email/teléfono/cédula/datos financieros y recorta
   cualquier `geo` más fino que un centroide.
3. **Una fuente solo se ingiere si tiene entrada en `sources.ts`** con sus
   compuertas (robots/ToS/login/acuerdo). Si falta una, no se ingiere.
4. **Atribuir, no aseverar:** cada item lleva procedencia + enlace de origen;
   nunca cifras propias; solo titular + extracto corto + enlace.

El buscador de personas (PII) vive en `lib/interop/` + `app/api/persons/`, **fuera**
de este plano y fuera de `/api/v1`. Ver `CLAUDE.md` y el plan del proyecto.
