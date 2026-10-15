# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to bump the root `package.json` version and prepend the changelog.

The workflow in `.github/workflows/release.yml` runs `changeset version` and opens a pull request. It does not run `changeset publish`, `npm publish`, or `deno publish`.

Changesets only sees the root package. After a version pull request, the workflow also copies that version into:

- `packages/create-supernuxt/package.json`
- `jsr.json`
- `packages/create-supernuxt/jsr.json`
- `deno.json`
- `library_version` in `skills/use-supernuxt/SKILL.md`

It does not change `supernuxt.nuxt` in the create package. That field stays equal to `dependencies.nuxt`, which is a separate pin.

Add a changeset with `npx changeset` when a change should show up in the changelog. Publishing to npm or JSR stays a manual maintainer step, as described in `content/docs/information.md`.
