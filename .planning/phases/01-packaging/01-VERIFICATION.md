# Phase 1 verification (2026-10-15 AEDT) — status: passed
| Must-have | Evidence |
|---|---|
| Four packages with correct boundaries | npm pack --dry-run: supernuxt 61 files/156.3 kB, @supernuxt/core 29/10.5 kB, @supernuxt/nuxt 13/2.9 kB, create-supernuxt 5/3.9 kB; 0 test files |
| Built ESM + types | publint "All good" x3; attw node16-ESM + bundler green for core and nuxt |
| JSR ready | deno publish --dry-run: @supernuxt/core + @supernuxt/create, no slow types, Success |
| Quality gates | npm ci, npm test (12 tests), rs check, nuxt typecheck, nuxt build all exit 0 from a clean install |
| Release staged, non-running | release.yml workflow_dispatch only + var gate; no publish/tag performed |
human_needed: none (packaging only; no UI change beyond type-only edits).
