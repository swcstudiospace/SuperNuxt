---
title: Architecture
description: How the layer, the module, the ledger, server functions, the studio, and Rstack fit together.
section: Architecture
order: 1
---

SuperNuxt is a Nuxt 4.6 layer. The package entry `.` is `nuxt.config.ts`, which calls `defineLayerConfig` in `src/domain/layer.ts`. A consumer that extends the layer gets the module, the CSS, the landing page, this documentation, and the studio. The export `./nuxt` is the module alone, at `modules/supernuxt/index.ts`.

Nuxt serves the app with Vite. Rstack builds the pieces around the repository: tests, lint, the core library, and the static console. User documentation is this Nuxt app. Pages are markdown in `content/docs`. There is no second docs site.

## Layer and module

`defineLayerConfig` sets `$meta.name` to `supernuxt`, turns telemetry off, and pins `compatibilityDate` to `2026-10-14`. It registers `@nuxt/ui` and the SuperNuxt module. CSS paths are absolute, resolved from the package root, so a consumer project cannot replace them by accident. The two stylesheets are `app/assets/css/main.css` and `app/assets/css/studio.css`.

Extending the layer is the install the scaffolder writes:

```ts
export default defineNuxtConfig({
  extends: ["supernuxt"],
});
```

That brings the default pages. `/` is the landing page, `/docs` is this site, and `/studio` is the TanStack reference. Those routes stay until the app adds a file at the same path.

Registering the module without the layer skips those pages and still installs the auto-imports and the Query plugin:

```ts
export default defineNuxtConfig({
  modules: ["supernuxt"],
});
```

Inside this repository the module is local: `modules: ["./modules/supernuxt"]`. The module's `configKey` is `supernuxt`, and it declares compatibility with Nuxt `>=4.0.0`. Parsed options are written to `runtimeConfig.public.supernuxt`. `useSuperNuxt()` reads them back.

The module auto-imports `useQuery`, `useMutation`, `useQueryClient`, `useLiveQuery`, `useStore`, `useForm`, `useTable`, `useVirtualizer`, `useHotkey`, `useHotkeys`, `useChat`, `useServerFn`, `useMissionBoard`, and `useSuperNuxt`. A page does not import them.

The Query plugin in `modules/supernuxt/runtime/query.ts` builds one `QueryClient` per request. `staleTime` comes from the module options, and queries retry once. On the server it dehydrates that client during `app:rendered`. On the client it hydrates only when that state is present. Passing an empty state into `hydrate()` is avoided on purpose.

## Ledger

Mission rows live in one process-local ledger. `shared/missions.ts` is the seed. `server/ledger.ts` calls `createLedger` once. Status values are `standby`, `fueling`, `ascent`, `coast`, and `hold`.

`GET /api/missions` waits 160 milliseconds, then returns a copy of the board. `PATCH /api/missions/:id` sends `{ status }`. `applyStatus` never mutates the array it was given. The same id and the same status returns the same mission and `changed: false`. An unknown id returns 404. A body without a known status returns 400.

The DB bench on `/studio/db` keeps inserts in a local-only collection. Ids that start with `local-` (`isDraftId`) stay on the client and are not patched through this ledger.

Server functions read the ledger. They do not write it. `dispatchServerFn` in `src/domain/contracts.ts` takes a snapshot from `ledger.list()`.

## Server functions

`useServerFn` is the stand-in for a TanStack Start server function. Start itself targets React and Solid, so SuperNuxt does not mount it. The client calls a named function. Nitro validates the body and runs the handler.

```ts
const briefing = useServerFn("briefing");
const result = await briefing.call({ missionId: "kite-4" });
```

The request goes to `POST /api/__supernuxt/fn/briefing`, using `useRequestFetch` so the call works during SSR and from the browser. Names are lowercase letters, numbers, and hyphens, and must start with a letter. `assertServerFnName` rejects anything else.

`briefing` is the only name the registry accepts. The input is `{ missionId }` checked with Zod. The result is `{ missionId, headline, note }`. `headline` is the mission code and status, for example `KITE-4 is ascent`. An unknown function name returns 404. A missing mission id returns 400. An id that is not on the board returns 404.

The route is `server/api/__supernuxt/fn/[name].post.ts`. It looks the name up through `dispatchServerFn` and returns the handler value. Handlers stay free of browser APIs.

## Studio

`/studio` is a working example for each TanStack library that ships a Vue adapter, and for the tooling packages that stay on the framework. The route table is `studioPages` in `shared/nav.ts`. Every catalog id appears on exactly one page.

| Library                | Route              | What the bench shows                   |
| ---------------------- | ------------------ | -------------------------------------- |
| Query                  | `/studio/query`    | SSR dehydrate, hydrate, and a mutation |
| DB                     | `/studio/db`       | A local collection and a live query    |
| Store                  | `/studio/store`    | A client store with selectors          |
| Start                  | `/studio/start`    | Server functions on Nitro              |
| AI                     | `/studio/ai`       | `useChat` against a local text adapter |
| Table                  | `/studio/table`    | Headless sorting                       |
| Charts                 | `/studio/charts`   | The Vue chart adapter                  |
| Form                   | `/studio/form`     | Field validation                       |
| Ranger                 | `/studio/ranger`   | A multi-handle range                   |
| Virtual                | `/studio/virtual`  | A windowed list                        |
| Pacer                  | `/studio/pacer`    | Debounce and a rate limit              |
| Hotkeys                | `/studio/hotkeys`  | A shortcut registry                    |
| Router                 | `/studio/router`   | Vue Router on memory history           |
| Markdown and Highlight | `/studio/prose`    | The prose pipeline used by these docs  |
| Devtools               | `/studio/devtools` | The dock and the Vue Query panel       |

Nuxt owns the document URL. The router bench mounts `@tanstack/vue-router` with `createMemoryHistory` inside the page. The AI bench uses a local Nitro adapter and does not need an API key. Markdown for these pages is `@tanstack/markdown`.

When `queryDevtools` is true, studio routes mount the TanStack Devtools dock with the Vue Query panel registered as a plugin. The layout reads that flag from `useSuperNuxt()`.

## Rstack

`rstack.config.ts` is the Rstack CLI config. `npm test`, `npm run lint`, `npm run format`, and `npm run check` go through the `rs` binary.

| Script                 | Tool       | What it does                                  |
| ---------------------- | ---------- | --------------------------------------------- |
| `npm test`             | Rstest     | Runs the tests under `src/`                   |
| `npm run lint`         | Rslint     | Lints the repository                          |
| `npm run format`       | Rstack CLI | Formats with the shared printer               |
| `npm run check`        | Rstack CLI | Lint plus format check                        |
| `npm run lib`          | Rslib      | Bundles `src/index.ts` as ESM                 |
| `npm run rstack:build` | Rsbuild    | Writes the console to `public/rstack-console` |
| `npm run rstack:dev`   | Rsbuild    | Serves that console on port 47831             |
| `npm run doctor`       | Rsdoctor   | A build report for the Rsbuild console        |

Rspack is the bundler underneath Rsbuild, Rslib, and Rstest. Rspress ships inside the Rstack toolchain. SuperNuxt does not use it for a docs site. The pages you are reading are rendered by this app from `content/docs`.

TanStack Config, CLI, and Intent are installed for the framework, not for the studio benches. Config 0.22 has no root export, so `tooling/publish.ts` imports `@tanstack/config/publish`. Intent validates `skills/use-supernuxt/SKILL.md`.

Continue with [Usage](/docs/usage) to create an app and call the module, or [Information](/docs/information) for install commands and publishing.
