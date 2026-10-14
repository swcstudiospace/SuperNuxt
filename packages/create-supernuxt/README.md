# create-supernuxt

Scaffolds a SuperNuxt app. The new project extends the `supernuxt` layer, so the landing page and documentation site are already there.

```bash
npm create supernuxt@latest
pnpm create supernuxt
bunx create-supernuxt
npx create-supernuxt@latest
deno run -A jsr:@supernuxt/create my-app
```

`npm create supernuxt` and `pnpm create supernuxt` only work after this package is published to npm under the name `create-supernuxt`. From a clone of the framework, run `npm run create -- my-app --framework file:.` instead. The publish steps are in the framework docs at `/docs/publish`.

The favicon written into the app is the same mark as `supernuxt`'s `public/brand/mark.svg`.
