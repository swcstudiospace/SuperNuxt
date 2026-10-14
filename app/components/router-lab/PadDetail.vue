<script setup lang="ts">
import { useParams } from "@tanstack/vue-router";

const params = useParams({ strict: false });
</script>

<template>
  <article>
    <h2>Pad {{ params.padId }}</h2>
    <p>
      This route is owned by TanStack Router, mounted with memory history beside
      Nuxt.
    </p>
  </article>
</template>
