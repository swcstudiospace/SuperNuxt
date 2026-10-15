---
name: use-supernuxt
description: >
  Use when adding SuperNuxt to a Nuxt 4 app, wiring TanStack Vue Query SSR,
  or calling a SuperNuxt server function from a Vue page.
metadata:
  purpose: "Register the SuperNuxt module and use its Query plugin and server functions."
  type: framework
  framework: nuxt
  library: supernuxt
  library_version: 0.2.0
sources:
  - "@swcstudio/supernuxt-nuxt:src/module.ts"
  - "@swcstudio/supernuxt-nuxt:src/runtime/query.ts"
requires: []
---

# Use SuperNuxt

## Setup

Add the module in `nuxt.config.ts`.

```ts
export default defineNuxtConfig({
  modules: ["@swcstudio/supernuxt-nuxt"],
});
```

The module registers a per-request `QueryClient`, dehydrates it on `app:rendered`, and hydrates only when that state exists.

## Core Patterns

### Prefetch a query during SSR

Call `useQuery`, then `await suspense()` on the server before the template reads `data`.

```ts
const { data, suspense } = useQuery({
  queryKey: ["missions"],
  queryFn: () => $fetch("/api/missions"),
});

const onServer = typeof window === "undefined";

if (onServer) {
  await suspense();
}
```

### Call a server function

`useServerFn` posts to `/api/__supernuxt/fn/<name>`. Names are lowercase with hyphens.

```ts
const briefing = useServerFn<{ headline: string }, { missionId: string }>(
  "briefing",
);
const result = await briefing.call({ missionId: "kite-4" });
```

## Common Mistakes

### Hydrating an empty Query cache

Passing `null` into `hydrate()` throws on current Vue Query. The plugin hydrates only when the dehydrated state is present.

### Replacing Nuxt's router with TanStack Router

Nuxt owns the document URL. Mount `@tanstack/vue-router` with `createMemoryHistory` inside a page when you need its typed routes.

## Completion

Load a page that calls `useQuery`. The first response should include the data in HTML, and a second client fetch should not be required while the query is fresh.
