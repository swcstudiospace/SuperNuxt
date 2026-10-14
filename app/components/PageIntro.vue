<script setup lang="ts">
defineProps<{
  kicker: string;
  title: string;
  lede: string;
}>();
</script>

<template>
  <header>
    <p class="kicker">{{ kicker }}</p>
    <h1>{{ title }}</h1>
    <p class="lede">{{ lede }}</p>
  </header>
</template>
