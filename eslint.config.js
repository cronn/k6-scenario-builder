import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export const eslintConfig = tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
    },
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      parserOptions: {
        projectService: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    rules: {
      "no-console": ["warn"],
      "no-debugger": ["warn"],
      "func-style": ["error", "declaration"],
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
);

export default eslintConfig;
