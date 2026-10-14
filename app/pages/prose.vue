<script setup lang="ts">
import { highlightToHtml } from "@tanstack/highlight";
import { parseMarkdown, renderHtml } from "@tanstack/markdown";

const source = `export default defineNuxtConfig({
  modules: ["./modules/supernuxt"],
})`;

const highlighted = highlightToHtml(source, { lang: "ts" });

const documentHtml = renderHtml(
  parseMarkdown(
    [
      "## What the prose bench does",
      "",
      "TanStack Markdown parses this note into a document, then renders HTML.",
      "TanStack Highlight paints the module snippet beside it.",
      "",
      "Both libraries are framework-neutral, so SuperNuxt mounts their output in Vue.",
    ].join("\n"),
  ),
);
</script>

<template>
  <PageIntro
    kicker="Markdown and Highlight"
    title="Prose lab"
    lede="The note below is parsed with TanStack Markdown. The config sample is highlighted with TanStack Highlight."
  />

  <div class="grid">
    <article class="paper markdown" v-html="documentHtml" />
    <div v-html="highlighted" />
  </div>
</template>
