---
title: "Publish"
description: "How to put SuperNuxt on npm and JSR so the install commands work."
section: Ship
order: 10
---

The install commands are not scripts in this repo. They are registry lookups. `npm create supernuxt` asks npm for a package named `create-supernuxt` and runs its `create-supernuxt` binary. Nothing works from a laptop that has not published that package, except the local `npm run create` path in [Installation](/docs/installation).

You publish two npm packages and two JSR packages. They share one version. The root `package.json` `version` and `dependencies.nuxt` are the pin. The create package copies both into `version` and `supernuxt.nuxt`.

## What each name does

| You publish                 | Registry name           | Command it unlocks                                                                               |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| This repository             | npm `supernuxt`         | `npx supernuxt my-app`, and the dependency the scaffolder writes                                 |
| `packages/create-supernuxt` | npm `create-supernuxt`  | `npm create supernuxt`, `pnpm create supernuxt`, `npx create-supernuxt`, `bunx create-supernuxt` |
| This repository             | JSR `@supernuxt/core`   | `jsr:@supernuxt/core` library import. The Nuxt app still installs from npm                       |
| `packages/create-supernuxt` | JSR `@supernuxt/create` | `deno run -A jsr:@supernuxt/create my-app`                                                       |

`npm create <name>` always looks up `create-<name>`. The bin field inside `create-supernuxt` must stay `create-supernuxt`. The bin field on `supernuxt` must stay `supernuxt`. Both point at `packages/create-supernuxt/index.mjs`.

## Try it before the registry

From the repository root:

```bash
node packages/create-supernuxt/index.mjs /tmp/harbor --framework file:$PWD
cd /tmp/harbor
npm install
npm run dev
```

`file:$PWD` installs this checkout as the `supernuxt` dependency. The app should open the landing page, `/docs`, and `/studio`. Fix the framework here if that fails. Publishing a broken layer just ships the failure.

## npm

You need an npm account and the package names `supernuxt` and `create-supernuxt` available to you. Both `package.json` files set `publishConfig.access` to `public`. Neither package is `private`.

```bash
npm login
npm publish
cd packages/create-supernuxt
npm publish
```

The second publish has to see a version that is not already on npm. Bump the root version and `packages/create-supernuxt/package.json` together, including `supernuxt.nuxt` when the Nuxt pin changes, then publish the framework first so the scaffolder's dependency exists.

Confirm from a clean directory:

```bash
npm create supernuxt@latest harbor
npx supernuxt harbor-two
```

## JSR

`jsr.json` at the root names `@supernuxt/core`. `packages/create-supernuxt/jsr.json` names `@supernuxt/create`. Deno publishes the package whose `jsr.json` is in the working directory.

```bash
deno login
deno publish
cd packages/create-supernuxt
deno publish
```

Then:

```bash
deno run -A jsr:@supernuxt/create harbor
```

## After a release

The generated app depends on `supernuxt` at `^` plus the create package version, and on `nuxt` at the exact pin in `supernuxt.nuxt`. Users do not clone this repository. They run one of the commands above, install, and start.
