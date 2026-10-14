# SuperNuxt

SuperNuxt is a Nuxt 4 framework that wires in the TanStack libraries and the Rstack toolchain. This repository is the reference studio: a flight desk you can click through, plus the module other Nuxt apps can register.

Nuxt 4.6 serves the app. TanStack Query handles server state with SSR. Table, Form, Charts, Virtual, DB, Store, AI, Hotkeys, Pacer, Ranger, Markdown, Highlight, Devtools, and Vue Router each have a bench. TanStack Start targets React and Solid, so SuperNuxt maps its server-function idea onto Nitro. Config, CLI, and Intent stay on the tooling side.

Rstack builds everything around the Nuxt app: Rsbuild and Rspack for a static console, Rslib for the core library, Rstest for tests, Rslint and the formatter for checks, Rspress for these docs, and Rsdoctor for a build report.

## Run the studio

Node.js 22.21 or newer.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:47821](http://127.0.0.1:47821).

## Use the module

```ts
export default defineNuxtConfig({
  modules: ["supernuxt"],
  supernuxt: {
    staleTime: 30_000,
    queryDevtools: true,
  },
});
```

In this repo the module is local: `modules: ["./modules/supernuxt"]`.

`useQuery`, `useMutation`, `useLiveQuery`, `useStore`, `useForm`, `useTable`, `useVirtualizer`, `useHotkey`, `useChat`, and `useServerFn` are auto-imported.

## Scripts

| Script                 | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Nuxt studio on port 47821                    |
| `npm run build`        | Production Nuxt build                        |
| `npm test`             | Rstest                                       |
| `npm run lint`         | Rslint                                       |
| `npm run format`       | Format with the Rstack CLI                   |
| `npm run lib`          | Rslib build of `src/`                        |
| `npm run rstack:build` | Rsbuild console into `public/rstack-console` |
| `npm run rstack:dev`   | Rsbuild dev server on port 47831             |
| `npm run docs:dev`     | Rspress docs on port 47823                   |
| `npm run doctor`       | Rsdoctor report for the Rsbuild console      |

The AI bench uses a local TanStack AI text adapter. It does not call an external model and does not need a key.

TanStack Config 0.22 is deprecated upstream and has no root export. SuperNuxt imports `@tanstack/config/publish` from `tooling/publish.ts`.
