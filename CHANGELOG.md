# Changelog

All notable changes to SuperNuxt are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-10-14

First public release. `0.1.0` was a private package pin in this repository and was not published.

### Added

- Nuxt 4.6 layer (`nuxt` pinned at 4.6.1). `extends: ["supernuxt"]` ships the landing page, the documentation at `/docs`, and the TanStack studio at `/studio`. The module can also be registered on its own with `modules: ["supernuxt"]`.
- TanStack Vue studio: Query, DB, Store, AI, Table, Charts, Form, Ranger, Virtual, Pacer, Hotkeys, Router, Markdown, Highlight, and Devtools, plus a Nitro stand-in for TanStack Start server functions.
- Mission ledger (`GET /api/missions`, `PATCH /api/missions/:id`) and the `briefing` server function behind `useServerFn`.
- Module options `staleTime` and `queryDevtools`, a per-request Vue Query client, and auto-imports for the Vue adapters plus `useServerFn`, `useMissionBoard`, and `useSuperNuxt`.
- Rstack around the build: Rstest, Rslint, Rslib, Rsbuild, Rsdoctor, and the Rstack CLI (`rstack.config.ts`). Rspress stays inside that toolchain. User docs are the Nuxt app, rendered from `content/docs`.
- Scaffolder (`packages/create-supernuxt`) so these commands can create an app once the packages are published: `npm create supernuxt`, `pnpm create supernuxt`, `bunx create-supernuxt`, `npx create-supernuxt`, `npx supernuxt`, and `deno run -A jsr:@supernuxt/create`.

[0.2.0]: https://github.com/swcstudiospace/SuperNuxt/releases/tag/v0.2.0
