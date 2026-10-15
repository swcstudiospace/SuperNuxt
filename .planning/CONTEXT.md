# CONTEXT — current state (mapped 2026-10-15 AEDT, main @ 138579a)
- Nuxt 4.6.1, compatibilityDate 2026-10-14, typescript.strict true, tsconfig extends .nuxt only (no single-file/vue-tsc typecheck in CI).
- Modules: @nuxt/ui only + local `modules/supernuxt` (auto-imports TanStack composables, Query SSR plugin).
- Fonts: Google Fonts <link> hard-coded (privacy/CSP/perf issue) — no @nuxt/fonts. No @nuxt/image.
- SEO: static head meta only. No sitemap/robots/schema.org/OG image. Single `lang: en`, no i18n.
- Content: hand-rolled docs (content/docs/*.md + shared/docs.ts) — no @nuxt/content.
- Data: in-memory ledger (server/ledger.ts); no DB/ORM, no auth, no sessions.
- Security: /api/chat and /api/__supernuxt/fn/[name] unauthenticated, no rate limit, no headers/CSP, no body-size limits.
- Observability: none (no Sentry/OTel/logging).
- Tests: rs test on src/**/*.test.ts only (4 unit files); no @nuxt/test-utils, no component/e2e, no a11y, no perf budgets.
- Lint/format: Rstack (rs lint/fmt); no @nuxt/eslint.
- CI: one job, Node 22, npm test + check. No typecheck, build, e2e, Deno, `jsr publish --dry-run`, publint/attw, provenance.
- Packaging: root package exports raw .ts (nuxt.config.ts, modules/*.ts, src/index.ts) — no build step, no `types`, no dist; layer+module+core+CLI in one package; deps like @tanstack/* all hard deps (heavy). jsr.json/deno.json exist but export nuxt layer files (JSR can't type-check .vue / Nuxt auto-imports → slow-types failures likely). tooling/publish.ts wraps @tanstack/config publish. No changesets. CHANGELOG manual.

## Auto-accepted decisions (rule 5b, smart_discuss defaults) — auto-accepted
1. Split into packages: `supernuxt` (layer), `@supernuxt/nuxt` (module via @nuxt/module-builder), `@supernuxt/core` (framework-agnostic TS, JSR-first), `create-supernuxt` (CLI). Monorepo with pnpm/npm workspaces.
2. Auth default: nuxt-auth-utils (light, sealed cookies); better-auth as opt-in preset for orgs/2FA/SSO.
3. DB default: Drizzle ORM (+ NuxtHub/libSQL/Postgres adapters).
4. Keep TanStack Query (not Pinia Colada) as the data layer since it's the framework's identity; Pinia optional.
5. Keep Zod 4 (already in); expose Standard Schema so Valibot works.
6. Keep Rstack for lib build/test but add @nuxt/eslint + vue-tsc typecheck + Vitest via @nuxt/test-utils for Nuxt-runtime tests (rs test can't run Nuxt env).
7. Releases via Changesets with npm provenance + JSR OIDC publish from GitHub Actions.
8. Marketing/app split by route groups + routeRules (prerender marketing, SSR/SPA app).
