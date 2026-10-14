# SuperNuxt

SuperNuxt is a Nuxt 4 framework. A new app extends the layer and opens on the landing page. The TanStack studio is at `/studio`.

The documentation is the site inside the app at `/docs`. Those pages are the files in `content/docs`. There is no separate docs site.

Source, issues, and releases: [github.com/swcstudiospace/SuperNuxt](https://github.com/swcstudiospace/SuperNuxt).

## Create an app

These commands work after the packages are published. From this checkout, before that:

```bash
npm install
npm run create -- my-app --framework file:.
cd my-app
npm install
npm run dev
```

After publish:

```bash
npm create supernuxt@latest my-app
pnpm create supernuxt my-app
bunx create-supernuxt my-app
npx create-supernuxt@latest my-app
npx supernuxt my-app
deno run -A jsr:@supernuxt/create my-app
```

`npm create supernuxt` downloads the npm package `create-supernuxt`. `npx supernuxt` runs the binary on the `supernuxt` package. Use `bunx`, not `bun create`.

## Run this repository

Node.js 22.21 or newer.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:47821](http://127.0.0.1:47821). Read the docs at `/docs`.

## Scripts

| Script                     | What it does                      |
| -------------------------- | --------------------------------- |
| `npm run dev`              | Nuxt on port 47821                |
| `npm run build`            | Production build                  |
| `npm test`                 | Rstest                            |
| `npm run lint`             | Rslint                            |
| `npm run check`            | Lint plus format check            |
| `npm run create -- my-app` | Scaffold an app next to this repo |
| `npm run rstack:build`     | Rsbuild console                   |

The AI bench uses a local TanStack AI adapter and does not need a key.
