# Minimal SuperNuxt app

This directory matches the files `packages/create-supernuxt` writes. `supernuxt` is `file:../..`, this checkout, because `supernuxt` and `create-supernuxt` are not in the npm registry.

## Run it from this repository

From the repository root, with Node.js 22.23.3 (`.nvmrc`):

```bash
npm install
npm install --prefix examples/minimal
npm run dev --prefix examples/minimal
```

`/` is the layer landing page, `/docs` is the documentation, and `/studio` is the studio, until this app adds a page at the same path.

## StackBlitz

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/swcstudiospace/SuperNuxt/tree/cursor/docs-brand-hygiene-2706/examples/minimal)

The link addresses `examples/minimal` on branch `cursor/docs-brand-hygiene-2706`. Install uses `file:../..`. That resolves when the parent package is part of the project. A StackBlitz import that mounts only this folder cannot see `../..`, so install fails there until `supernuxt` is published. The commands above are the run path that uses this checkout.
