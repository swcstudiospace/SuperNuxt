---
title: "Publish"
description: "npm and JSR package names for the framework and the scaffolder."
section: Ship
order: 9
---

SuperNuxt is published to npm twice and to JSR twice: the framework, and the scaffolder.

## npm

| Package    | Install name       | What it contains                                           |
| ---------- | ------------------ | ---------------------------------------------------------- |
| Framework  | `supernuxt`        | The Nuxt layer, the module, the landing page, and the docs |
| Scaffolder | `create-supernuxt` | The `create-supernuxt` binary                              |

The framework package also exposes a `supernuxt` binary, so `npx supernuxt my-app` scaffolds without installing `create-supernuxt` first.

```bash
npm publish
cd packages/create-supernuxt && npm publish
```

Both packages are public. The framework `files` list includes `app`, `modules`, `server`, `shared`, `content`, `public/brand`, and `public/favicon.svg`. The favicon and `public/brand/mark.svg` are the same logo.

## Version

The framework and the scaffolder share a version. Bump both `package.json` files together. The scaffolder writes that version into the new app's dependency on `supernuxt`.

## A generated app

The new app depends on `nuxt`, `vue`, `vue-router`, and `supernuxt`. It does not copy the studio source. Those pages arrive through the layer when Nuxt resolves `extends: ["supernuxt"]`.
