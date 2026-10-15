<script setup lang="ts">
import { parseMarkdown, renderHtml } from "@tanstack/markdown";
import type { DocPage } from "../../src/domain/docs";

const props = defineProps<{
  page: DocPage;
  previous?: DocPage;
  next?: DocPage;
}>();

function slugify(value: string) {
  return value
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const html = computed(() => {
  const rendered = renderHtml(parseMarkdown(props.page.body));
  return rendered.replace(
    /<h([23])>(.*?)<\/h\1>/g,
    (_, level: string, inner: string) => {
      return `<h${level} id="${slugify(inner)}">${inner}</h${level}>`;
    },
  );
});

const toc = computed(() =>
  [...props.page.body.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    id: slugify(match[1] ?? ""),
    text: match[1] ?? "",
  })),
);
</script>

<template>
  <div class="docs-layout">
    <article>
      <p class="kicker">{{ page.section }}</p>
      <h1>{{ page.title }}</h1>
      <p class="lede">{{ page.description }}</p>
      <div class="markdown" v-html="html" />
      <div class="row" style="margin-top: 2rem">
        <NuxtLink v-if="previous" class="paper-button" :to="previous.href">
          {{ previous.title }}
        </NuxtLink>
        <NuxtLink v-if="next" class="paper-button primary" :to="next.href">
          {{ next.title }}
        </NuxtLink>
      </div>
    </article>
    <aside class="toc" aria-label="On this page">
      <p class="rail-label">On this page</p>
      <a v-for="item in toc" :key="item.id" :href="`#${item.id}`">{{
        item.text
      }}</a>
    </aside>
  </div>
</template>
