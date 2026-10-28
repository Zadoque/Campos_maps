import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "test-results/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      indent: ["error", 2, { SwitchCase: 1 }],
      "array-bracket-spacing": ["error", "never"],
      "block-spacing": ["error", "always"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": ["error", { before: false, after: true }],
      "eol-last": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-multi-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "quote-props": ["error", "as-needed"],
      quotes: ["error", "single", { avoidEscape: true }],
      semi: ["error", "always"],
      "space-before-blocks": ["error", "always"],
      "space-before-function-paren": [
        "error",
        { named: "never", anonymous: "always", asyncArrow: "always" },
      ],
      "space-infix-ops": "error",
      "spaced-comment": ["error", "always"],
      "max-len": [
        "error",
        {
          code: 140,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
