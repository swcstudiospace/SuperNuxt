<script setup lang="ts">
import { findDoc, neighbors } from "#layers/supernuxt/shared/docs";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const page = computed(() => findDoc(slug.value));

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "That doc page does not exist.",
  });
}

const adjacent = computed(() => neighbors(slug.value));
</script>

<template>
  <DocsArticle
    v-if="page"
    :page="page"
    :previous="adjacent.previous"
    :next="adjacent.next"
  />
</template>
