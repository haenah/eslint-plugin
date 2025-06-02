import cspellConfigs from "@cspell/eslint-plugin/configs";
import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import * as importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintPluginSortProperties from "eslint-plugin-sort-properties";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * @type {import('eslint').Linter.Config[]}\
 * @description JS, TS에서 공통적으로 사용되는 기본 설정
 */
const base = [
  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx}"],
    rules: eslint.configs.recommended.rules,
  },
  eslintPluginSortProperties.configs["flat/all"],
  cspellConfigs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: { ...globals.node, ...globals.browser },
      sourceType: "module",
    },
    plugins: {
      "core-frontend-ts": coreFrontendTsPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "@cspell/spellchecker": ["error"],
      "import/newline-after-import": "error",
      "import/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: [
            "builtin",
            "external",
            "internal",
            "type",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          pathGroups: [
            { group: "external", pattern: "@/**", position: "after" },
            {
              group: "builtin",
              pattern: "{react,react-dom,next/**}",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
        },
      ],
      "sort-imports": [
        "error",
        { ignoreCase: true, ignoreDeclarationSort: true },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
    settings: { "import/resolver": { typescript: true } },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true, jsxPragma: null } },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      ...tseslint.configs.strict.reduce(
        (acc, prev) => ({ ...acc, ...prev.rules }),
        {}
      ),
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

/**
 * @type {import('eslint').Linter.Config[]}
 * @description Next.js 프로젝트에서 사용되는 설정
 */
const next = [
  ...base,
  { ignores: ["out/", ".vercel/", ".next/", ".turbo/"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: {
      "@next/next": nextPlugin,
      "jsx-a11y": jsxA11yPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "jsx-a11y/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
          shorthandFirst: true,
          shorthandLast: false,
        },
      ],
    },
    settings: {
      next: { rootDir: "." },
      react: { version: "detect" },
    },
  },
];

export const coreFrontendEslintConfig = { base, next };
