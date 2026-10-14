<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

function goHome() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <main class="stage">
    <p class="kicker">Fault</p>
    <h1>The desk lost this page.</h1>
    <p class="lede">
      {{ props.error.statusCode }}
      {{ props.error.statusMessage || props.error.message }}
    </p>
    <button class="solid" type="button" @click="goHome">
      Back to the deck
    </button>
  </main>
</template>
