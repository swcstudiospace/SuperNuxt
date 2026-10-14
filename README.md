# SuperNuxt

SuperNuxt is a Nuxt 4 framework. A new app extends the layer and opens on a white and emerald landing page. The documentation site is part of the framework, at `/docs`. The TanStack studio is at `/studio`.

The logo is one file. `public/favicon.svg`, `public/brand/mark.svg`, and the favicon written by the scaffolder are the same emerald mark.

## Create an app

```bash
npm create supernuxt@latest
pnpm create supernuxt
bunx create-supernuxt
npx create-supernuxt@latest
npx supernuxt my-app
deno run -A jsr:@supernuxt/create my-app
```

`npm create` and `pnpm create` download `create-supernuxt`. `npx supernuxt` uses the binary on the `supernuxt` package. Deno can run the npm package before JSR is published:

```bash
deno run -A npm:create-supernuxt my-app
```

Then install and start. The landing page is already there, because the app extends the layer and does not ship its own `app/pages`.

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

## Run this repository

Node.js 22.21 or newer. Deno 2 is optional and uses the tasks in `deno.json`.

```bash
npm install
npm run dev
```

```bash
deno task dev
```

Open [http://127.0.0.1:47821](http://127.0.0.1:47821).

## Packages

| Registry | Name                | Role                                         |
| -------- | ------------------- | -------------------------------------------- |
| npm      | `supernuxt`         | The Nuxt layer and module                    |
| npm      | `create-supernuxt`  | The scaffolder behind `npm create supernuxt` |
| JSR      | `@supernuxt/core`   | The framework module entry                   |
| JSR      | `@supernuxt/create` | The Deno scaffolder                          |

## Scripts

| Script                     | What it does                    |
| -------------------------- | ------------------------------- |
| `npm run dev`              | Nuxt on port 47821              |
| `npm run build`            | Production build                |
| `npm test`                 | Rstest                          |
| `npm run lint`             | Rslint                          |
| `npm run create -- my-app` | Scaffold next to this repo      |
| `npm run docs:dev`         | Rspress reference on port 47823 |
| `npm run rstack:build`     | Rsbuild console                 |

The in-app documentation at `/docs` is the site that ships with an install. Rspress stays as the toolchain mirror.

The AI bench uses a local TanStack AI adapter and does not need a key.
