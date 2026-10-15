<uplift phase="milestone-v0.3" pass="1">
<ORIGINAL>Please check our SuperNuxt framework and advise how we can make this State-of-the-Art, Best-in-Class, Production-Grade and Enterprise-Ready using the best packages and libraries for Typescript Nuxt? We want to use SuperNuxt to build a marketing website and application behind it so we're checking if there's more we can add into it before we actually create the npm and deno packages</ORIGINAL>
<goal>Advisory gap analysis + roadmap; no source changes before publish decision.</goal>
<got>
 <node id="N1" name="Packaging">CoT: 1 map exports (raw .ts) 2 split layer/module/core/cli 3 module-builder dist + types 4 JSR slow-types check 5 publint/attw 6 changesets+provenance</node>
 <node id="N2" name="Quality gates">CoT: 1 typecheck absent 2 add nuxt typecheck 3 @nuxt/eslint 4 @nuxt/test-utils 5 Playwright+axe 6 CI matrix Node22/24+Deno</node>
 <node id="N3" name="Security">CoT: 1 open /api endpoints 2 nuxt-security headers/CSP 3 rate limit chat 4 auth guard server-fn 5 body limits</node>
 <node id="N4" name="Marketing">CoT: 1 static meta only 2 @nuxtjs/seo 3 @nuxt/content 4 @nuxt/image+fonts 5 prerender routeRules</node>
 <node id="N5" name="App">CoT: 1 in-memory ledger 2 Drizzle 3 nuxt-auth-utils 4 i18n</node>
 <node id="N6" name="Observability">CoT: 1 none 2 Sentry 3 OTel 4 health/logs</node>
 <node id="N7" name="Perf/DX">CoT: 1 heavy hard deps 2 optional peer deps 3 LHCI budgets 4 flags/analytics</node>
 <edges>N1→N2→N3; N3→N5; N4∥N5; N6 after N5; N7 last</edges>
</got>
<tracking>Kickoff deferred: Linear/Notion rows are created once PLAN files exist (rule 4c); advisory run stopped before plan-phase PLANs.</tracking>
</uplift>
