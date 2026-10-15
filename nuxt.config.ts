import type { NuxtConfig } from "nuxt/schema";
import { defineLayerConfig } from "./config/layer";

const layer = defineLayerConfig(import.meta.url) as unknown as NuxtConfig;

export default defineNuxtConfig({
  ...layer,
  buildDir: ".nuxt",
});
