---
title: "Module"
description: "Extend the layer or register the module, and the options it accepts."
section: Framework
order: 4
---

Add the module to a Nuxt 4 app you already have, or extend the layer and take the landing page with it.

## Extend the layer

```ts
export default defineNuxtConfig({
  extends: ["supernuxt"],
  supernuxt: {
    staleTime: 30_000,
    queryDevtools: true,
  },
});
```

Extending the layer registers the module, the white and emerald theme, the landing page, the docs, and the studio. Your own `app/pages/index.vue` replaces the landing page. Other layer pages stay until you add a file at the same path.

## Module only

```ts
export default defineNuxtConfig({
  modules: ["supernuxt"],
});
```

Use this when you want the auto-imports and the Query plugin without the default pages. In this repository the module is local: `modules: ["./modules/supernuxt"]`.

## Options

| Option          | Default | What it does                                         |
| --------------- | ------- | ---------------------------------------------------- |
| `staleTime`     | `30000` | How long TanStack Query treats server data as fresh. |
| `queryDevtools` | `true`  | Mount the Vue Query panel inside the devtools dock.  |

## Auto-imports

`useQuery`, `useMutation`, `useQueryClient`, `useLiveQuery`, `useStore`, `useForm`, `useTable`, `useVirtualizer`, `useHotkey`, `useHotkeys`, `useChat`, and `useServerFn` are registered by the module. You do not import them in a page.
