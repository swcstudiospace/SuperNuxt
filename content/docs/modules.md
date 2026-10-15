---
title: Modules
description: Opt-out flags for the Nuxt modules SuperNuxt registers beside TanStack and the Rstack console.
section: Modules
order: 4
---

SuperNuxt registers optional Nuxt modules from `modules/supernuxt/index.ts`. Each one has a boolean on the `supernuxt` key. `false` omits that module, so its hooks and routes are not added. Secret-bearing modules stay inert until their environment variables are set. None of the defaults turn on telemetry or a paid feature.

The Rstack CLI still builds only the side console (`rstack/index.ts` into `public/rstack-console`). These modules attach to the Nuxt app, which `nuxt build` builds with Vite.

## Flags

Set them in `nuxt.config.ts`. The defaults below are what this repository ships.

| Flag       | Default | Package                      | What `false` does                                                                                                                                                                                                                                  |
| ---------- | ------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`    | `true`  | `@nuxt/image`                | Removes the module. The default provider is local `ipx`.                                                                                                                                                                                           |
| `fonts`    | `true`  | `@nuxt/fonts`                | Removes the module. Remote providers (Google, Fontshare, Fontsource, Bunny, Adobe, npm) are off, so the module does not download fonts.                                                                                                            |
| `seo`      | `true`  | `@nuxtjs/seo`                | Removes sitemap, robots, schema.org, and OG image. `sitemap`, `robots`, and `ogImage` can each be `false` while `seo` stays `true`. The link checker and skew-protection polling are off.                                                          |
| `scripts`  | `true`  | `@nuxt/scripts`              | Removes the module. The registry is empty: no third-party script is registered.                                                                                                                                                                    |
| `i18n`     | `true`  | `@nuxtjs/i18n`               | Removes the module and its `/_i18n` routes. While on, the strategy is `no_prefix` and browser detection is off, so existing paths stay put.                                                                                                        |
| `hints`    | `true`  | `@nuxt/hints`                | Removes the module. It already returns immediately outside `nuxt dev`, and it does not inject third-party scripts.                                                                                                                                 |
| `devtools` | `true`  | Nuxt DevTools                | Sets `devtools.enabled` to `false`. `devtools: { enabled: false }` in the Nuxt config does the same.                                                                                                                                               |
| `security` | `true`  | `nuxt-security`              | Removes the module, its headers, and its middleware. `security.enabled: false` is also honored: the module returns before it registers headers. The CSP has no `*` and no scheme-wide `https:`.                                                    |
| `sentry`   | `true`  | `@sentry/nuxt`               | With no `SENTRY_DSN`, the module is not installed and `Sentry.init` is not called. `false` keeps it out even when a DSN is set. Tracing and replay are omitted. `SENTRY_AUTH_TOKEN` is used only at build time for source maps.                    |
| `auth`     | `false` | `better-auth`, `drizzle-orm` | The default. `true` registers `/api/auth/**`. The handler still returns 404 and does not open Postgres until `BETTER_AUTH_SECRET` (32 characters or more) and a `postgres://` or `postgresql://` `DATABASE_URL` are both set. Boot never connects. |
| `content`  | `false` | `@nuxt/content`              | The default. `content/docs` keeps the renderer in `src/domain/docs.ts`.                                                                                                                                                                            |

```ts
export default defineNuxtConfig({
  extends: ["supernuxt"],
  supernuxt: {
    image: false,
    fonts: false,
    seo: false,
    scripts: false,
    i18n: false,
    hints: false,
    devtools: false,
    security: false,
    sentry: false,
    auth: false,
    content: false,
  },
});
```

`npm test` covers these gates in `src/domain/modules.test.ts`. Component and browser checks are separate: `npm run test:component` and `npm run test:e2e`. They are not part of `npm test`.

## Security headers

With `security: true`, nuxt-security sends its default header set and this Content-Security-Policy:

- `script-src` is `'self'` plus a nonce. Dev also allows `'unsafe-eval'` and local `ws:` / `http://127.0.0.1:*` sockets so Vite, Nuxt DevTools, and the TanStack devtools dock can run.
- `font-src` allows `'self'` and `https://fonts.gstatic.com`, because the layer already loads the Google font stylesheet.
- `style-src` allows `'self'`, `'unsafe-inline'`, and `https://fonts.googleapis.com`.
- CSRF and basic auth stay off. No secret is required.

nuxt-security `2.6` declares `engines.node` of `>=24`. This repository's engines and CI use Node 22, so the dependency is `nuxt-security` `2.5.x` (`>=20`).

## Auth and Sentry

Schema and the SQL file live in `server/db/schema.ts` and `server/db/migrations/0001_auth.sql`. SuperNuxt does not apply the SQL. GitHub OAuth is registered only when both `BETTER_AUTH_GITHUB_CLIENT_ID` and `BETTER_AUTH_GITHUB_CLIENT_SECRET` are set. `AUTH_SECRET` is accepted as an alias of `BETTER_AUTH_SECRET`. Names and empty placeholders are in `.env.example`. `SECURITY.md` lists the same names.

TanStack DB (`@tanstack/vue-db`) stays the client collection on `/studio/db`. better-auth and drizzle are a server auth layer and do not replace it.

## Not included

| Package                             | Why it is absent                                                                                                                                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pinia                               | `@tanstack/vue-store` is already a direct dependency.                                                                                                                                                                                                                                                   |
| VeeValidate                         | `@tanstack/vue-form` is already a direct dependency.                                                                                                                                                                                                                                                    |
| `@nuxt/eslint`                      | `npm run lint` is `rs lint`. `rstack.config.ts` calls `define.lint`.                                                                                                                                                                                                                                    |
| Vercel AI SDK (`ai`, `@ai-sdk/vue`) | `@tanstack/ai` and `@tanstack/ai-vue` are already direct dependencies.                                                                                                                                                                                                                                  |
| vite-pwa                            | `define.app` in `rstack.config.ts` builds `./rstack/index.ts` into `public/rstack-console`. The Nuxt app is `nuxt build`, and Nuxt 4 uses Vite for that app, so a Vite PWA plugin is not incompatible with the app builder. It would not cover the Rstack console, and this module set does not add it. |
