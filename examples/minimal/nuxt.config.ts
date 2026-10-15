export default defineNuxtConfig({
  extends: ["supernuxt"],
  telemetry: false,
  compatibilityDate: "2026-10-14",
  supernuxt: {
    staleTime: 30_000,
    queryDevtools: true,
  },
});
