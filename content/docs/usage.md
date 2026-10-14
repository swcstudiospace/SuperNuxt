---
title: "Usage"
description: "What you do after the scaffolder finishes: run the app, replace the landing page, and call the framework."
section: Start
order: 3
---

A SuperNuxt app is a Nuxt 4 app that extends the `supernuxt` layer. You do not copy the studio or this documentation into your project. They arrive with the package.

## First run

From the directory the scaffolder created:

```bash
npm install
npm run dev
```

pnpm, Bun, and Deno use the same two steps with their own install and dev commands. The printed next step from the scaffolder is the one that matches `--pm`.

Open the URL Nuxt prints. `/` is the SuperNuxt landing page. `/docs` is this site. `/studio` is the TanStack reference. Those routes stay until you add a file at the same path.

## Your own home page

```vue
<template>
  <main>
    <h1>Harbor desk</h1>
  </main>
</template>
```

Save that as `app/pages/index.vue`. Nuxt uses your file instead of the layer landing page. `/docs` and `/studio` stay. Delete the file and the landing page comes back.

`app/app.vue` in the scaffold is the root shell. Leave the `NuxtLayout` and `NuxtPage` tags in place. The layer layout draws the header, the docs sidebar, and the studio rail.

## Call the framework

The module auto-imports the TanStack composables and `useServerFn`. A page does not import them.

```ts
const missions = useQuery({
  queryKey: ["missions", "live"],
  queryFn: () => $fetch("/api/missions"),
});
```

```ts
const briefing = useServerFn("briefing");
const result = await briefing.call({ missionId: "kite-4" });
```

`result` is a briefing: `missionId`, `headline`, and `note`. The name `"briefing"` is the only server function shipped today. A name that is not in the registry returns 404.

`useMissionBoard()` is the manifest and the table. It reads `GET /api/missions` and advances a row with `PATCH`. Sending the status a row already has does not change it.

## Options

Set these in `nuxt.config.ts` when the defaults are wrong. `staleTime` is how long Vue Query treats a response as fresh, in milliseconds. `queryDevtools` mounts the Vue Query panel on studio routes. `false` hides that dock.

```ts
export default defineNuxtConfig({
  extends: ["supernuxt"],
  supernuxt: {
    staleTime: 30_000,
    queryDevtools: true,
  },
});
```

## Module without the pages

An existing Nuxt app can take the composables and skip the landing page, docs, and studio:

```ts
export default defineNuxtConfig({
  modules: ["supernuxt"],
});
```

`extends: ["supernuxt"]` is the install the scaffolder writes. Use that when you want the pages.
