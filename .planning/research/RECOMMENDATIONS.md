# SuperNuxt → SOTA recommendations (2026-10-15 AEDT)
## MUST
- Packaging: @nuxt/module-builder for the module (dist + types) https://github.com/nuxt/module-builder ; split layer/module/core/cli; JSR via jsr.json + `deno publish --dry-run` https://jsr.io/docs/publishing-packages ; publint, @arethetypeswrong/cli, Changesets, npm provenance.
- Quality: `nuxt typecheck`/vue-tsc in CI; @nuxt/eslint https://nuxt.com/modules/eslint ; @nuxt/test-utils + Vitest https://nuxt.com/docs/4.x/getting-started/testing ; Playwright + axe.
- Security: nuxt-security https://nuxt.com/modules/security (CSP, rate limit, size limits, CORS); guard /api/chat and /api/__supernuxt/fn.
- Marketing: @nuxtjs/seo v6 (needs Nuxt ≥4.6.1 — you're on 4.6.1) https://nuxt.com/modules/seo ; @nuxt/content https://nuxt.com/modules/content ; @nuxt/image https://nuxt.com/modules/image ; @nuxt/fonts https://nuxt.com/modules/fonts (replace Google Fonts <link>); @nuxt/scripts https://nuxt.com/modules/scripts.
## SHOULD
- Auth: nuxt-auth-utils https://nuxt.com/modules/auth-utils (default) / @nuxtjs/better-auth https://better-auth.nuxt.dev/ (enterprise preset).
- Data: Drizzle ORM https://orm.drizzle.team ; i18n: @nuxtjs/i18n https://nuxt.com/modules/i18n.
- Observability: @sentry/nuxt https://docs.sentry.io/platforms/javascript/guides/nuxt/ ; OpenTelemetry.
## NICE
- Lighthouse CI budgets, feature flags (OpenFeature), PostHog/Plausible via @nuxt/scripts, Nuxt Studio CMS, Renovate, oxlint.
## Packaging gaps
1 exports point at raw .ts / nuxt.config.ts, no `types`, no dist. 2 one package mixes layer+module+core+CLI with ~25 hard @tanstack deps (make most optional peers). 3 JSR exports include Nuxt/.vue files → slow-types/auto-import failures; publish only `@supernuxt/core` to JSR first. 4 deno.json/jsr.json versions duplicated manually. 5 no CI dry-runs, no provenance, no changesets. 6 engines ≥22.21 vs @nuxtjs/seo v6 needing ^22.22.3.
