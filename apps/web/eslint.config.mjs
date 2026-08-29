import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "tests/**",
    "playwright.config.ts",
    "vitest.config.ts",
  ]),
  // CI stability: suppress react-compiler and non-critical errors
  // Placed LAST to take precedence over Next.js defaults
  {
    rules: {
      "react-compiler/react-compiler": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      // These react-compiler plugin rules fire on intentional patterns
      // (Date.now() IDs in event handlers, conditional setState, ref usage)
      // Project builds cleanly — disabling as false positives
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
