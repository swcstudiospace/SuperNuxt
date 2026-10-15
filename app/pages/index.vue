<script setup lang="ts">
import { installCommands } from "#layers/supernuxt/shared/nav";
import { rstackTools, tanstackLibraries } from "@swcstudio/supernuxt-core";

const copied = ref("");

async function copy(command: string) {
  copied.value = command;
  await navigator.clipboard.writeText(command);
}

const tabs = installCommands.map((item) => ({
  label: item.label,
  value: item.id,
  command: item.command,
}));
</script>

<template>
  <section class="home">
    <div class="hero">
      <BrandLockup class="hero" :size="72" to="/" />
      <div class="hero-copy">
        <p class="kicker">Nuxt framework</p>
        <h1>The white and emerald Nuxt layer.</h1>
        <p class="lede">
          SuperNuxt installs with npm, pnpm, Bun, npx, or Deno. The first page
          is this landing screen. The documentation site is built in. The studio
          behind it runs the TanStack libraries on Nuxt 4.
        </p>
      </div>
      <img
        class="banner"
        src="/brand/banner.jpg"
        alt="SuperNuxt, the Nuxt framework for TanStack and Rstack"
        width="1200"
        height="675"
      />
    </div>

    <h2>Install</h2>
    <UTabs :items="tabs" color="primary" variant="pill" default-value="npm">
      <template #content="{ item }">
        <div class="command">
          <code>{{ item.command }}</code>
          <UButton size="sm" color="primary" @click="copy(item.command)">
            {{ copied === item.command ? "Copied" : "Copy" }}
          </UButton>
        </div>
      </template>
    </UTabs>

    <div class="grid" style="margin-top: 1.5rem">
      <article class="card">
        <p class="kicker">Host</p>
        <h2>Nuxt 4.6</h2>
        <p>
          A layer, a module, and Nitro server functions. Your app starts with
          the landing page already mounted.
        </p>
      </article>
      <article class="card">
        <p class="kicker">Libraries</p>
        <h2>{{ tanstackLibraries.length }} TanStack</h2>
        <p>
          Vue adapters where they exist. Start's server-function idea runs on
          Nitro.
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
    </div>

    <div class="row" style="margin-top: 1.5rem">
      <UButton to="/docs" color="primary" size="lg">Read the docs</UButton>
      <UButton to="/studio" color="neutral" variant="outline" size="lg"
        >Open the studio</UButton
      >
    </div>
  </section>
</template>
