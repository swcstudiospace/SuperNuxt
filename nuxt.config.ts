import { defineLayerConfig } from "./src/domain/layer";

export default defineNuxtConfig(defineLayerConfig(import.meta.url));
