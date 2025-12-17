import js from "@eslint/js";
import globals from "globals";

export default [
   {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  {
    files: ["tests/**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    plugins: {
      extends: ["airbnb-base/legacy"]
    },
  }
];