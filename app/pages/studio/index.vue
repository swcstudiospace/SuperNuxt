<script setup lang="ts">
import { rstackTools, tanstackLibraries } from "../../../src/index";
import { studioNav } from "../../../shared/nav";

const routeFor: Record<string, string> = {
  query: "/studio/query",
  db: "/studio/db",
  store: "/studio/store",
  ai: "/studio/ai",
  table: "/studio/table",
  charts: "/studio/charts",
  form: "/studio/form",
  hotkeys: "/studio/hotkeys",
  virtual: "/studio/virtual",
  pacer: "/studio/pacer",
  ranger: "/studio/ranger",
  router: "/studio/router",
  markdown: "/studio/prose",
  highlight: "/studio/prose",
  start: "/studio/start",
  devtools: "/studio/devtools",
  config: "/studio/rstack#tanstack-tools",
  cli: "/studio/rstack#tanstack-tools",
  intent: "/studio/rstack#tanstack-tools",
};

function hrefFor(id: string) {
  return routeFor[id] ?? "/studio/rstack";
}

const linked = tanstackLibraries.filter(
  (entry) =>
    studioNav.some((item) => item.href === hrefFor(entry.id)) ||
    hrefFor(entry.id).startsWith("/"),
);
</script>

<template>
  <PageIntro
    kicker="Flight desk"
    title="SuperNuxt"
    lede="A Nuxt 4 framework with the TanStack libraries on the Vue side and the Rstack toolchain around the build. This studio is the reference app."
  />

  <section class="grid" aria-label="Framework facts">
    <article class="card">
      <p class="kicker">Host</p>
      <h2>Nuxt 4.6</h2>
      <p>File routes, Nitro server functions, and SSR for TanStack Query.</p>
    </article>
    <article class="card">
      <p class="kicker">Libraries</p>
      <h2>{{ tanstackLibraries.length }} TanStack</h2>
      <p>
        Vue adapters where they exist. Start is bridged onto Nitro because it
        targets React and Solid.
      </p>
    </article>
    <article class="card">
      <p class="kicker">Toolchain</p>
      <h2>{{ rstackTools.length }} Rstack</h2>
      <p>
        Rspack, Rsbuild, Rslib, Rspress, Rsdoctor, Rstest, Rslint, and the
        Rstack CLI.
      </p>
    </article>
  </section>

  <h2 style="margin-top: 2rem">Open a bench</h2>
  <div class="grid">
    <NuxtLink
      v-for="entry in linked"
      :key="entry.id"
      class="card"
      :to="hrefFor(entry.id)"
    >
      <p class="kicker">{{ entry.group }}</p>
      <h3>{{ entry.name }}</h3>
      <p>{{ entry.summary }}</p>
    </NuxtLink>
  </div>
</template>
