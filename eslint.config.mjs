import js from "@eslint/js";

export default [
   {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  {
    plugins: {
      extends: ["airbnb-base/legacy"]
    },
  }
];