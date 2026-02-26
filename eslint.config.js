// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,

  {
    rules: {
      // Optional overrides
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
    },
  },

  {
    ignores: ["dist/*", "node_modules"],
  },
]);