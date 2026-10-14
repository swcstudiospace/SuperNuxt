---
title: "Installation"
description: "Create an app with npm, pnpm, Bun, npx, or Deno."
section: Start
order: 2
---

These commands download the scaffolder and write a new app. They work after `supernuxt` and `create-supernuxt` are on npm, and after `@supernuxt/create` is on JSR. Publishing those packages is [Publish](/docs/publish). Until then, run the scaffolder from this repository with `npm run create`.

## Create an app

```bash
npm create supernuxt@latest my-app
pnpm create supernuxt my-app
bunx create-supernuxt my-app
npx create-supernuxt@latest my-app
npx supernuxt my-app
deno run -A jsr:@supernuxt/create my-app
```

`npm create supernuxt` and `pnpm create supernuxt` both install the npm package named `create-supernuxt`. `npx create-supernuxt` is that same package. `npx supernuxt` runs the `supernuxt` binary, which is the same script shipped inside the framework package. `bun create` is a different Bun feature and does not run this scaffolder. Use `bunx`.

Deno can run the npm package before the JSR publish:

```bash
deno run -A npm:create-supernuxt my-app
```

From a clone of this repository, before either registry has the package:

```bash
npm run create -- my-app --framework file:.
cd my-app
npm install
npm run dev
```

`--framework file:.` points the new app at this checkout instead of the npm release. Pass `--force` if `my-app` already exists and is not empty. `--pm pnpm`, `--pm bun`, or `--pm deno` only changes the install and dev lines the command prints.

## Files it writes

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

`nuxt.config.ts` extends `supernuxt`. `app/app.vue` renders the layout and the page. There is no `app/pages` directory, so `/`, `/docs`, and `/studio` come from the layer. The favicon is the same mark as `public/brand/mark.svg` in the framework.

## Run it

```bash
cd my-app
npm install
npm run dev
```

```bash
pnpm install && pnpm dev
bun install && bun run dev
deno install && deno task dev
```

The first screen is the SuperNuxt landing page. Continue with [Usage](/docs/usage).
