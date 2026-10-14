import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: "2026-10-14",
  telemetry: false,
  modules: ["./modules/supernuxt"],
  css: ["~/assets/css/studio.css"],
  devtools: { enabled: false },
  build: {
    transpile: [
      "@tanstack/charts",
      "@tanstack/vue-devtools",
      "@tanstack/vue-router",
      "@tanstack/vue-db",
    ],
  },
  app: {
    head: {
      title: "SuperNuxt",
      htmlAttrs: { lang: "en" },
      meta: [
        {
          name: "description",
          content:
            "SuperNuxt is a Nuxt 4 framework with TanStack Query, Table, Form, DB, AI, and the rest of the TanStack catalog, built with the Rstack toolchain.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,520;9..144,680&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@380;520;640&display=swap",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      supernuxt: {
        staleTime: 30_000,
        queryDevtools: true,
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        // dayjs publishes a UMD main file. Devtools UI imports it as ESM.
        dayjs: require.resolve("dayjs/esm/index.js"),
      },
    },
    optimizeDeps: {
      include: [
        "dayjs",
        "@tanstack/ai-vue",
        "@tanstack/charts",
        "@tanstack/charts/vue",
        "@tanstack/db",
        "@tanstack/highlight",
        "@tanstack/markdown",
        "@tanstack/ranger",
        "@tanstack/store",
        "@tanstack/vue-devtools",
        "@tanstack/vue-form",
        "@tanstack/vue-hotkeys",
        "@tanstack/vue-pacer",
        "@tanstack/vue-query-devtools",
        "@tanstack/vue-router",
        "@tanstack/vue-store",
        "@tanstack/vue-table",
        "@tanstack/vue-virtual",
      ],
    },
  },
  nitro: {
    externals: {
      inline: ["zod"],
    },
  },
  typescript: {
    strict: true,
  },
  alias: {
    dayjs: require.resolve("dayjs/esm/index.js"),
  },
});
