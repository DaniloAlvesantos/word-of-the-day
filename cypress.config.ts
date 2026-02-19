import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "src/components/**/*.cy.{ts,tsx}",
    excludeSpecPattern: "**/pronounceButton/*.cy.tsx",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
