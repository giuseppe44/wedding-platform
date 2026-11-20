import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "Caricamento_Github_Parte_1/**",
    "Caricamento_Github_Parte_2/**",
    "Progetto_Matrimoni_Sicuro_Completo/**",
    "Desktop_Deploy/**",
    "APRI_E_TRASCINA_QUESTI_4_ELEMENTI/**",
  ]),
]);

export default eslintConfig;
