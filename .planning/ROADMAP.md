# ROADMAP — milestone v0.3 "SOTA / enterprise-ready" (advisory; not executed)
| # | Phase | Priority | Key packages |
|---|---|---|---|
| 1 | Packaging & release foundation | MUST | @nuxt/module-builder, tsdown/rs lib (core), publint, @arethetypeswrong/cli, @changesets/cli, jsr/deno publish --dry-run, npm provenance |
| 2 | Quality gates: types, lint, tests | MUST | vue-tsc / `nuxt typecheck`, @nuxt/eslint (+ oxlint opt), @nuxt/test-utils + Vitest, Playwright, @axe-core/playwright |
| 3 | Security baseline | MUST | nuxt-security (headers, CSP nonce, rate limit, request size, CSRF), auth on /api/chat & server-fn, zod-validated bodies |
| 4 | Marketing-site stack | MUST | @nuxt/content v3, @nuxtjs/seo v6 (sitemap/robots/schema-org/og-image/link-checker), @nuxt/image, @nuxt/fonts (drop Google <link>), @nuxt/scripts |
| 5 | App foundation: auth + data | SHOULD | nuxt-auth-utils (or @nuxtjs/better-auth preset), Drizzle ORM (+drizzle-kit), @nuxtjs/i18n |
| 6 | Observability & ops | SHOULD | @sentry/nuxt, OpenTelemetry (nitro-opentelemetry), structured logging (evlog/consola), health endpoint |
| 7 | Perf, a11y, DX extras | NICE | Lighthouse CI budgets, @nuxt/a11y / eslint-plugin-vuejs-accessibility, feature flags (OpenFeature/PostHog), analytics (@nuxt/scripts Plausible/PostHog), CMS adapter (Nuxt Studio), Renovate |

Success criteria per phase in recommendations doc. Next GSD command: `/gsd-plan-phase 1` then `/gsd-execute-phase 1` (needs Ove's go).
