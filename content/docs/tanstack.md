---
title: "TanStack"
description: "Every TanStack bench in the studio and the packages that stay on the toolchain."
section: Integrations
order: 6
---

SuperNuxt integrates the TanStack libraries that ship a Vue adapter, and it documents the ones that stay on the tooling side.

## On the studio

Open `/studio` and each bench is a working example.

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

## Tooling packages

TanStack Config, CLI, and Intent are installed for the framework itself. Config 0.22 has no root export, so publish helpers import `@tanstack/config/publish` from `tooling/publish.ts`. Intent validates `skills/use-supernuxt/SKILL.md`.

TanStack Start targets React and Solid. SuperNuxt does not pretend to mount Start. It keeps the server-function shape and runs it on Nitro. See [server functions](/docs/server-functions).
