<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

function goHome() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <main class="stage">
    <BrandLockup />
    <p class="kicker">Missing page</p>
    <h1>That route is not in the layer.</h1>
    <p class="lede">
      {{ props.error.statusCode }}
      {{ props.error.statusMessage || props.error.message }}
    </p>
    <button class="solid" type="button" @click="goHome">
      Back to SuperNuxt
    </button>
  </main>
</template>
