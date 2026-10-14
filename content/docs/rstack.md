---
title: "Rstack"
description: "Rspack, Rsbuild, Rslib, Rspress, Rsdoctor, Rstest, Rslint, and the CLI."
section: Integrations
order: 8
---

Nuxt serves the app with Vite. Rstack builds the pieces around this repository: the core library, the tests, the linter, the formatter, and the static console.

## Commands

| Script                 | Tool       | What it does                                  |
| ---------------------- | ---------- | --------------------------------------------- |
| `npm test`             | Rstest     | Runs the tests under `src/`                   |
| `npm run lint`         | Rslint     | Lints the repository                          |
| `npm run format`       | Rstack CLI | Formats with the shared printer               |
| `npm run check`        | Rstack CLI | Lint plus format check                        |
| `npm run lib`          | Rslib      | Bundles `src/`                                |
| `npm run rstack:build` | Rsbuild    | Writes the console to `public/rstack-console` |
| `npm run doctor`       | Rsdoctor   | A build report for the Rsbuild console        |

Rspack is the bundler underneath Rsbuild, Rslib, and Rstest. The Rstack CLI is the `rs` binary behind `rstack.config.ts`. Rspress is part of that toolchain. SuperNuxt does not keep a second docs site. The pages you are reading are the documentation, rendered by this Nuxt app from `content/docs`.
