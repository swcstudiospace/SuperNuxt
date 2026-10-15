---
title: Usage
description: Create an app, run it, replace the landing page, and call useQuery, useServerFn, and useMissionBoard.
section: Usage
order: 2
---

A SuperNuxt app is a Nuxt 4 app that extends the `supernuxt` layer. You do not copy the studio or this documentation into the project. They arrive with the package. [Information](/docs/information) lists what the scaffolder writes and how publishing turns the commands below into registry lookups.

## Create an app

After `@swcstudio/supernuxt` and `create-supernuxt` are on npm, and `@swcstudiospace/create-supernuxt` is on JSR:

```bash
npm create supernuxt@latest my-app
pnpm create supernuxt my-app
bunx create-supernuxt my-app
npx create-supernuxt@latest my-app
npx --package=@swcstudio/supernuxt supernuxt my-app
deno run -A jsr:@swcstudiospace/create-supernuxt my-app
```

`bun create` is a different Bun feature. Use `bunx`. From a clone of the framework, before either registry has the package:

```bash
npm run create -- my-app --framework file:.
```

`--framework file:.` points the new app at this checkout. Pass `--force` if `my-app` already exists and is not empty. `--pm pnpm`, `--pm bun`, or `--pm deno` only changes the install and dev lines the command prints. The default directory name is `supernuxt-app` when you omit one.

## Run it

From the directory the scaffolder created:

```bash
npm install
npm run dev
```

pnpm, Bun, and Deno use the same two steps with their own commands. The printed next step matches `--pm`.

```bash
pnpm install && pnpm dev
bun install && bun run dev
deno install && deno task dev
```

Open the URL Nuxt prints. `/` is the SuperNuxt landing page. `/docs` is this site. `/studio` is the TanStack reference. Those routes stay until you add a file at the same path.

## Replace the landing page

```vue
<template>
  <main>
    <h1>Harbor desk</h1>
  </main>
</template>
```

Save that as `app/pages/index.vue`. Nuxt uses your file instead of the layer landing page. `/docs` and `/studio` stay. Delete the file and the landing page comes back.

`app/app.vue` in the scaffold is the root shell. Leave the `NuxtLayout` and `NuxtPage` tags in place. The layer layout draws the header, the docs sidebar, and the studio rail.

## Call useQuery

The module auto-imports TanStack Query. A page does not import `useQuery`.

```ts
const missions = useQuery({
  queryKey: ["missions", "live"],
  queryFn: () => $fetch("/api/missions"),
});

if (import.meta.server) {
  await missions.suspense();
}
```

`staleTime` on the module is how long Vue Query treats that response as fresh. The default is 30 seconds. On the server, `await suspense()` before the template reads `data`. The plugin dehydrates the client after render and hydrates the browser only when that state exists. See [Architecture](/docs) for the plugin.

## Call useServerFn

```ts
const briefing = useServerFn("briefing");
const result = await briefing.call({ missionId: "kite-4" });
```

`result` is `{ missionId, headline, note }`. `"briefing"` is the only server function shipped today. A name that is not in the registry returns 404. Names are lowercase letters, numbers, and hyphens. The post goes to `/api/__supernuxt/fn/briefing`.

## Call useMissionBoard

`useMissionBoard()` is the manifest and the table. It reads `GET /api/missions` under the query key `["missions", "live"]` and advances a row with `PATCH /api/missions/:id`. `advance` sends the next status in `standby`, `fueling`, `ascent`, `coast`, `hold`, then invalidates `["missions"]`. Sending the status a row already has does not change it.

```ts
const board = useMissionBoard();
await board.prefetch();
```

`prefetch` calls `suspense()` on the server. Pass `{ fault }` with a `Ref<boolean>` when you want the query to fail with `Ground link refused the manifest.` The studio uses that to show the error state. The query key becomes `["missions", "fault"]`.

## Module options

Set these in `nuxt.config.ts` when the defaults are wrong. `staleTime` is a nonnegative number of milliseconds. `queryDevtools` mounts the TanStack Devtools dock, including the Vue Query panel, on studio routes. `false` hides that dock. Any other shape throws when the module loads.

```ts
export default defineNuxtConfig({
  extends: ["@swcstudio/supernuxt"],
  supernuxt: {
    staleTime: 30_000,
    queryDevtools: true,
  },
});
```

`useSuperNuxt()` returns the parsed options from public runtime config.

## Module without the pages

An existing Nuxt app can take the composables and skip the landing page, docs, and studio:

```ts
export default defineNuxtConfig({
  modules: ["@swcstudio/supernuxt-nuxt"],
});
```

`extends: ["@swcstudio/supernuxt"]` is what the scaffolder writes. Use that when you want the pages. The difference is described in [Architecture](/docs).

Install commands, the file tree, and publishing are in [Information](/docs/information).
