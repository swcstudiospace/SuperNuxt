<script setup lang="ts">
import { navGroups, studioNav } from "../../shared/nav";

const route = useRoute();
const helpOpen = ref(false);

useHotkey(
  "Mod+/",
  () => {
    helpOpen.value = !helpOpen.value;
  },
  { ignoreInputs: true },
);

function isActive(href: string) {
  if (href === "/") return route.path === "/";
  return route.path === href || route.path.startsWith(`${href}/`);
}
</script>

<template>
  <div class="shell">
    <header class="top">
      <NuxtLink class="mark" to="/">Super<span>Nuxt</span></NuxtLink>
      <p class="top-note">Nuxt 4.6 · TanStack · Rstack</p>
      <div class="top-actions">
        <button class="ghost" type="button" @click="helpOpen = true">
          Shortcuts
        </button>
      </div>
    </header>

    <details class="mobile-nav">
      <summary>Sections</summary>
      <NuxtLink v-for="item in studioNav" :key="item.href" :to="item.href">
        {{ item.label }}
      </NuxtLink>
    </details>

    <div class="body">
      <nav class="rail" aria-label="Studio">
        <div v-for="group in navGroups" :key="group" class="rail-group">
          <p class="rail-label">{{ group }}</p>
          <NuxtLink
            v-for="item in studioNav.filter((link) => link.group === group)"
            :key="item.href"
            :class="{ active: isActive(item.href) }"
            :to="item.href"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>
      <main class="stage">
        <slot />
      </main>
    </div>

    <DevtoolsDock />

    <div v-if="helpOpen" class="help-layer" @click.self="helpOpen = false">
      <div class="paper help-card" role="dialog" aria-labelledby="help-title">
        <h2 id="help-title">Shortcuts</h2>
        <p>
          Mod+/ toggles this card. On the hotkeys bench, J and K move the pad
          cursor.
        </p>
        <p class="meta">
          The TanStack devtools dock sits on this shell. Vue Query has its own
          panel inside it.
        </p>
        <button
          class="paper-button primary"
          type="button"
          @click="helpOpen = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
