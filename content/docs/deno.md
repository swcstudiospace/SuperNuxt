---
title: "Deno"
description: "Deno tasks, JSR package names, and how the scaffolder runs."
section: Ship
order: 9
---

Deno runs the scaffolder and the framework tasks. The Nuxt app itself is the same package Node, Bun, and Deno install from npm.

## Tasks in this repository

`deno.json` names the package `@supernuxt/core` and defines:

```bash
deno task create my-app
deno task dev
deno task test
```

`deno task dev` starts Nuxt through Deno's npm compatibility. `deno task create` runs the scaffolder with Deno instead of Node. `nodeModulesDir` is `auto`, so Deno reuses the npm install.

## JSR

Publish the framework as `@supernuxt/core` from the repository root. Publish the scaffolder as `@supernuxt/create` from `packages/create-supernuxt`. The create package is also the npm package `create-supernuxt`. [Publish](/docs/publish) is the full sequence, including the local trial before either registry.

```bash
deno publish
cd packages/create-supernuxt
deno publish
```

After that, the install line is:

```bash
deno run -A jsr:@supernuxt/create my-app
```
