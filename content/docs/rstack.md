---
title: "Rstack"
description: "Rspack, Rsbuild, Rslib, Rspress, Rsdoctor, Rstest, Rslint, and the CLI."
section: Integrations
order: 7
---

Nuxt serves the app with Vite. Rstack builds the pieces around it: the core library, the tests, the linter, the formatter, the static console, and a second docs site.

## Commands

| Script                 | Tool       | What it does                                  |
| ---------------------- | ---------- | --------------------------------------------- |
| `npm test`             | Rstest     | Runs `src/index.test.ts`                      |
| `npm run lint`         | Rslint     | Lints the repository                          |
| `npm run format`       | Rstack CLI | Formats with the shared printer               |
| `npm run check`        | Rstack CLI | Lint plus format check                        |
| `npm run lib`          | Rslib      | Bundles `src/`                                |
| `npm run rstack:build` | Rsbuild    | Writes the console to `public/rstack-console` |
| `npm run docs:dev`     | Rspress    | Markdown docs on port 47823                   |
| `npm run doctor`       | Rsdoctor   | A build report for the Rsbuild console        |

Rspack is the bundler underneath Rsbuild, Rslib, Rstest, and Rspress. The Rstack CLI is the `rs` binary behind `rstack.config.ts`.

The documentation you are reading is the SuperNuxt site, rendered by this Nuxt app. Rspress remains available for the toolchain reference. Both describe the same framework.
