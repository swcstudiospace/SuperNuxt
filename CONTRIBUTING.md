# Contributing to SuperNuxt

SuperNuxt is a Nuxt 4 framework. Issues and pull requests are welcome at [github.com/swcstudiospace/SuperNuxt](https://github.com/swcstudiospace/SuperNuxt).

## What you need

- Node.js 22.22.3+ or 24.15+. The root `package.json` `engines` field is the pin.
- npm. The lockfile is `package-lock.json`.

```bash
npm install
npm test
npm run check
```

`npm test` runs Rstest over `src/**/*.test.ts`. `npm run check` runs Rslint and the format check from `rstack.config.ts`. If the format check fails, run `npm run format` and commit the result.

`npm run dev` starts Nuxt at `http://127.0.0.1:47821`.

## Documentation

User docs live only in `content/docs` and render in the Nuxt app at `/docs`. Do not add a `docs/` site, Rspress config, or a second documentation build.

Each page is markdown with frontmatter: `title`, `description`, `section`, and `order`. `section` is one of `Architecture`, `Usage`, or `Information`. The parser is `packages/core/src/docs.ts`. The corpus test in `test/upgrades.test.ts` lists the expected slugs. The architecture page is served at `/docs`.

Keep the three sections to those concerns:

- Architecture: layer versus module, the mission ledger, server functions, the studio, and Rstack around the build.
- Usage: creating and running an app, replacing the landing page, `useQuery`, `useServerFn`, `useMissionBoard`, and module options.
- Information: install commands, scaffolder output, publishing, version and support, and links to this repository.

## Pull requests

- Describe the behavior you changed and how you checked it (`npm test`, `npm run check`, and the route you loaded if the Nuxt app changed).
- Versions are kept in lockstep by `npm run version` (Changesets + `tooling/sync-versions.mjs`): every `package.json`, both `deno.json` files under `packages/`, and `library_version` in `skills/use-supernuxt/SKILL.md`. The create package field `supernuxt.nuxt` stays equal to `dependencies.nuxt`.
- Do not commit `node_modules`, `.nuxt`, `.output`, or generated Rstack output. Those paths are gitignored.

## Reporting problems

Bugs and feature requests use the GitHub issue templates. Vulnerability reports go through [private security advisories](https://github.com/swcstudiospace/SuperNuxt/security/advisories/new), as described in `SECURITY.md`. This repository does not hold production secrets.
