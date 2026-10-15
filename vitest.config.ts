import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    include: ["test/component/**/*.spec.ts"],
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom",
        overrides: {
          supernuxt: {
            image: false,
            fonts: false,
            seo: false,
            scripts: false,
            i18n: false,
            hints: false,
            devtools: false,
            security: false,
            sentry: false,
            auth: false,
            content: false,
          },
        },
      },
    },
  },
});
