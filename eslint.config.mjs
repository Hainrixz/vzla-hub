import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Frontera dura entre planos: el motor agg (público, SIN PII) NUNCA importa
  // del plano app (PII). Verificado por el linter en CI, no por convención.
  {
    files: ["lib/agg/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app", "@/app/*", "../../app/*", "../app/*"],
              message:
                "lib/agg es el plano público sin PII y NUNCA debe importar de app (plano con PII). Ver lib/agg/README.md y CLAUDE.md.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
