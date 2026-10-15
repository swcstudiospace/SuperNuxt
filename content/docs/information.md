---
title: Information
description: Install commands, the files the scaffolder writes, publishing, and version support.
section: Information
order: 3
---

The install commands are registry lookups. They work after `supernuxt` and `create-supernuxt` are on npm, and after `@supernuxt/create` is on JSR. Until then, run the scaffolder from a clone with `npm run create`.

Repository: [github.com/swcstudiospace/SuperNuxt](https://github.com/swcstudiospace/SuperNuxt). Issues: [github.com/swcstudiospace/SuperNuxt/issues](https://github.com/swcstudiospace/SuperNuxt/issues).

## Install commands

```bash
npm create supernuxt@latest my-app
pnpm create supernuxt my-app
bunx create-supernuxt my-app
npx create-supernuxt@latest my-app
npx supernuxt my-app
deno run -A jsr:@supernuxt/create my-app
```

`npm create supernuxt` and `pnpm create supernuxt` both install the npm package named `create-supernuxt`. `npx create-supernuxt` is that same package. `npx supernuxt` runs the `supernuxt` binary, which is the same script shipped inside the framework package. `bun create` does not run this scaffolder. Use `bunx`.

Deno can run the npm package before the JSR publish:

```bash
deno run -A npm:create-supernuxt my-app
```

## What the scaffolder writes

```txt
my-app/
  package.json
  nuxt.config.ts
  app/app.vue
  tsconfig.json
  deno.json
  README.md
  public/favicon.svg
  .gitignore
  .nuxtrc
```

`package.json` depends on `nuxt` at the exact pin recorded in the create package (`supernuxt.nuxt`, currently `4.6.1`), on `supernuxt` at `^` plus the create package version, and on `vue` and `vue-router`. `nuxt.config.ts` extends `supernuxt` and sets `staleTime: 30_000` and `queryDevtools: true`. `app/app.vue` renders `NuxtLayout` and `NuxtPage`. There is no `app/pages` directory, so `/`, `/docs`, and `/studio` come from the layer. `telemetry` is off, and `.nuxtrc` sets `telemetry.enabled=false`.

The scaffolder also accepts `--dir`, `--help`, and `--yes`. `--yes` is accepted so non-interactive runners do not fail. It does not prompt.

## From this repository

Node.js 22.22.3+ or 24.15+.

```bash
npm install
npm run dev
```

The dev server listens on `127.0.0.1` port `47821`. `deno task dev` starts the same Nuxt app through Deno's npm compatibility. `deno.json` names this package `@supernuxt/core`, sets `nodeModulesDir` to `auto`, and also defines `deno task create` and `deno task test`.

Before either registry has the package:

```bash
node packages/create-supernuxt/index.mjs /tmp/harbor --framework file:$PWD
cd /tmp/harbor
npm install
npm run dev
```

`file:$PWD` installs this checkout as the `supernuxt` dependency. The app should open the landing page, `/docs`, and `/studio`. `npm run create -- my-app --framework file:.` is the same scaffolder.

## Publishing

You publish two npm packages and two JSR packages. They share one version. The root `package.json` `version` and `dependencies.nuxt` are the pin. The create package copies both into `version` and `supernuxt.nuxt`. Neither package is `private`. Both npm `package.json` files set `publishConfig.access` to `public`.

| You publish                 | Registry name           | Command it unlocks                                                                               |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| This repository             | npm `supernuxt`         | `npx supernuxt my-app`, and the dependency the scaffolder writes                                 |
| `packages/create-supernuxt` | npm `create-supernuxt`  | `npm create supernuxt`, `pnpm create supernuxt`, `npx create-supernuxt`, `bunx create-supernuxt` |
| This repository             | JSR `@supernuxt/core`   | `jsr:@supernuxt/core` library import. The Nuxt app still installs from npm                       |
| `packages/create-supernuxt` | JSR `@supernuxt/create` | `deno run -A jsr:@supernuxt/create my-app`                                                       |

`npm create <name>` always looks up `create-<name>`. The bin inside `create-supernuxt` must stay `create-supernuxt`. That is the command `npm create`, `pnpm create`, `bunx`, and `npx create-supernuxt` run. The `supernuxt` package ships two bins, `supernuxt` and `create-supernuxt`, and both point at `packages/create-supernuxt/index.mjs`. `npx supernuxt` runs the `supernuxt` bin.

Publish the framework first so the scaffolder's dependency exists. Bump the root version and `packages/create-supernuxt/package.json` together, including `supernuxt.nuxt` when the Nuxt pin changes. The same version is written to both `jsr.json` files, `deno.json`, and `library_version` in `skills/use-supernuxt/SKILL.md`.

```bash
npm login
npm publish
cd packages/create-supernuxt
npm publish
```

```bash
deno login
deno publish
cd packages/create-supernuxt
deno publish
```

`jsr.json` at the root names `@supernuxt/core`. `packages/create-supernuxt/jsr.json` names `@supernuxt/create`. Deno publishes the package whose `jsr.json` is in the working directory.

Confirm from a clean directory:

```bash
npm create supernuxt@latest harbor
npx supernuxt harbor-two
deno run -A jsr:@supernuxt/create harbor-three
```

The generated app depends on `supernuxt` at `^` plus that version, and on `nuxt` at the exact pin. Users do not clone this repository.

## Version and support

| Item        | Value                                     |
| ----------- | ----------------------------------------- |
| SuperNuxt   | 0.2.0, the first public release           |
| Earlier pin | 0.1.0 was `private` and was not published |
| Nuxt        | 4.6.1, exact, in `dependencies.nuxt`      |
| Module      | Nuxt `>=4.0.0`                            |
| Node.js     | `^22.22.3 \|\| >=24.15.0`                 |
| Vue         | `^3.5.22`, with `vue-router` `^4.5.1`     |

Supported releases are 0.2.x. Report vulnerabilities through [private security advisories](https://github.com/swcstudiospace/SuperNuxt/security/advisories/new). The repository does not contain production secrets.

How the layer is put together is [Architecture](/docs). Calling it from an app is [Usage](/docs/usage).
