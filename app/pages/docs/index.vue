<script setup lang="ts">
import { docPages, neighbors } from "#layers/supernuxt/shared/docs";

const page = docPages[0];
if (!page) {
  throw createError({ statusCode: 404, statusMessage: "Missing architecture" });
}
const { previous, next } = neighbors(page.slug);
</script>

<template>
  <DocsArticle :page="page" :previous="previous" :next="next" />
</template>
