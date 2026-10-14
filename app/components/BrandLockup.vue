<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string;
    size?: number;
    word?: boolean;
  }>(),
  {
    to: "/",
    size: 28,
    word: true,
  },
);
</script>

<template>
  <NuxtLink
    class="lockup"
    :to="to"
    :aria-label="word ? undefined : 'SuperNuxt'"
  >
    <img
      class="lockup-mark"
      src="/brand/mark.svg"
      alt=""
      :width="size"
      :height="size"
    />
    <span v-if="word" class="lockup-name">Super<span>Nuxt</span></span>
  </NuxtLink>
</template>
