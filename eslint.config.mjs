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
    // Inspected production bundles and the unchanged third-party Draco decoder.
    "docs/research/air-inc-footer/source/**",
    "public/sites/air-inc-footer/draco/**",
  ]),
]);

export default eslintConfig;
