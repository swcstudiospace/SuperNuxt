SuperNuxt installs from npm and from JSR. The scaffolder writes only the files an app needs. The framework layer supplies the landing page and this documentation site.

## Create an app

```bash
npm create supernuxt@latest
pnpm create supernuxt
bunx create-supernuxt
npx create-supernuxt@latest
deno run -A jsr:@supernuxt/create
```

`npm create supernuxt` resolves the `create-supernuxt` package. `npx supernuxt` runs the same scaffolder from the `supernuxt` package. Deno can also run the npm package before the JSR publish:

```bash
deno run -A npm:create-supernuxt my-app
```

Pass a directory name, or `--dir`. Add `--pm npm`, `--pm pnpm`, `--pm bun`, or `--pm deno` to print the matching install and dev commands. The scaffolder does not prompt when the terminal is not interactive.

## Files the scaffolder writes

```txt
my-app/
  package.json
  nuxt.config.ts
  app/app.vue
  tsconfig.json
  deno.json
  README.md
  public/favicon.svg
```

`nuxt.config.ts` extends the `supernuxt` layer. `app/app.vue` renders `NuxtLayout` and `NuxtPage`. There is no `app/pages` directory, so the layer's landing page stays in place until you add one.

## Run it

```bash
cd my-app
npm install
npm run dev
```

With Deno, from the same directory:

```bash
deno install
deno task dev
```

The first screen is the SuperNuxt landing page. Documentation is at `/docs`. The TanStack studio is at `/studio`.
