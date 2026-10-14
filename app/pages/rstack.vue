<script setup lang="ts">
interface StackEntry {
  id: string;
  name: string;
  kind: string;
  group: string;
  packageName: string | null;
  summary: string;
  version: string | null;
}

interface StackResponse {
  nuxt: string | null;
  vue: string | null;
  consoleBuilt: boolean;
  entries: StackEntry[];
}

const { data, error, pending, refresh } = useFetch<StackResponse>("/api/stack");
const rstack = computed(
  () => data.value?.entries.filter((entry) => entry.group === "Rstack") ?? [],
);
const tooling = computed(
  () =>
    data.value?.entries.filter((entry) =>
      ["config", "cli", "intent"].includes(entry.id),
    ) ?? [],
);
</script>

<template>
  <PageIntro
    kicker="Rstack"
    title="Toolchain"
    lede="Nuxt still serves this app with Vite. Rstack builds the core library, the console in the frame below, the docs, the tests, and the lint pass."
  />

  <p v-if="pending">Reading installed packages…</p>
  <p v-else-if="error" class="error" role="alert">
    The toolchain report failed.
    <button class="ghost" type="button" @click="refresh()">Try again</button>
  </p>
  <template v-else>
    <p class="meta">Nuxt {{ data?.nuxt }} · Vue {{ data?.vue }}</p>
    <div class="grid">
      <article v-for="entry in rstack" :key="entry.id" class="card">
        <p class="kicker">{{ entry.version ?? "via CLI" }}</p>
        <h3>{{ entry.name }}</h3>
        <p>{{ entry.summary }}</p>
      </article>
    </div>

    <h2 id="tanstack-tools" style="margin-top: 2rem">TanStack tooling</h2>
    <div class="grid">
      <article v-for="entry in tooling" :key="entry.id" class="card">
        <p class="kicker">{{ entry.version ?? "not installed" }}</p>
        <h3>{{ entry.name }}</h3>
        <p>{{ entry.summary }}</p>
      </article>
    </div>

    <h2 style="margin-top: 2rem">Rsbuild console</h2>
    <div class="paper">
      <iframe
        v-if="data?.consoleBuilt"
        class="iframe-frame"
        title="Rstack console"
        src="/rstack-console/index.html"
      />
      <p v-else class="meta">
        The console has not been built yet. Run
        <code>npm run rstack:build</code> and reload this page.
      </p>
    </div>
  </template>
</template>
