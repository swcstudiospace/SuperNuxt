<script setup lang="ts">
import { navGroups, studioNav } from "../../shared/nav";
import { docPages, docSections } from "../../shared/docs";

const route = useRoute();
const helpOpen = ref(false);
const query = ref("");
const policy = useSuperNuxt();

const section = computed(() => {
  if (route.path.startsWith("/docs")) return "docs";
  if (route.path.startsWith("/studio")) return "studio";
  return "home";
});

useHotkey(
  "Mod+/",
  () => {
    helpOpen.value = !helpOpen.value;
  },
  { ignoreInputs: true, conflictBehavior: "replace" },
);

function isActive(href: string) {
  if (href === "/studio") return route.path === "/studio";
  return route.path === href || route.path.startsWith(`${href}/`);
}

const filteredDocs = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!needle) return docPages;
  return docPages.filter((page) =>
    `${page.title} ${page.description} ${page.body}`
      .toLowerCase()
      .includes(needle),
  );
});
</script>

<template>
  <div class="shell">
    <header class="top">
      <BrandLockup />
      <p class="top-note">Nuxt 4.6 · TanStack · Rstack</p>
      <nav class="top-links" aria-label="Primary">
        <NuxtLink to="/docs" :class="{ active: section === 'docs' }"
          >Docs</NuxtLink
        >
        <NuxtLink to="/studio" :class="{ active: section === 'studio' }"
          >Studio</NuxtLink
        >
        <button
          v-if="section === 'studio'"
          class="ghost"
          type="button"
          @click="helpOpen = true"
        >
          Shortcuts
        </button>
      </nav>
    </header>

    <details v-if="section === 'studio'" class="mobile-nav">
      <summary>Studio sections</summary>
      <NuxtLink v-for="item in studioNav" :key="item.href" :to="item.href">
        {{ item.label }}
      </NuxtLink>
    </details>

    <div class="body" :class="{ 'body-home': section === 'home' }">
      <nav v-if="section === 'studio'" class="rail" aria-label="Studio">
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

      <nav
        v-else-if="section === 'docs'"
        class="rail docs-side"
        aria-label="Documentation"
      >
        <label>
          Search docs
          <input
            v-model="query"
            type="search"
            placeholder="Install, Query, Deno"
          />
        </label>
        <div v-for="group in docSections" :key="group" class="rail-group">
          <p class="rail-label">{{ group }}</p>
          <NuxtLink
            v-for="page in filteredDocs.filter(
              (item) => item.section === group,
            )"
            :key="page.slug"
            :class="{ active: route.path === page.href }"
            :to="page.href"
          >
            {{ page.title }}
          </NuxtLink>
        </div>
        <p v-if="!filteredDocs.length" class="meta">
          No pages match that search.
        </p>
      </nav>

      <main class="stage">
        <slot />
      </main>
    </div>

    <DevtoolsDock v-if="section === 'studio' && policy.queryDevtools" />

    <div v-if="helpOpen" class="help-layer" @click.self="helpOpen = false">
      <div class="paper help-card" role="dialog" aria-labelledby="help-title">
        <h2 id="help-title">Shortcuts</h2>
        <p>
          Mod+/ toggles this card. On the hotkeys bench, J and K move the pad
          cursor.
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
