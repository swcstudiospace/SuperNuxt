import { defineCollection, defineContentConfig } from "@nuxt/content";

/**
 * Read by @nuxt/content only when `supernuxt.content` is true.
 * The legacy docs renderer stays in place either way.
 */
export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: "page",
      source: "docs/**/*.md",
    }),
  },
});
