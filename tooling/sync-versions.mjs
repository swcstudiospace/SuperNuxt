#!/usr/bin/env node
// Changesets versions the workspace packages (fixed group). The version it
// picked for @swcstudio/supernuxt-core is the release version: copy it to the root
// `supernuxt` layer, every other manifest, the deno.json files JSR publishes,
// internal dependency pins and the agent skill.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const writeJson = (path, value) =>
  writeFileSync(new URL(path, root), `${JSON.stringify(value, null, 2)}\n`);

const version = JSON.parse(read("packages/core/package.json")).version;
const internal = ["@swcstudio/supernuxt-core", "@swcstudio/supernuxt-nuxt"];

for (const path of [
  "package.json",
  "packages/core/package.json",
  "packages/nuxt/package.json",
  "packages/create-supernuxt/package.json",
  "packages/core/deno.json",
  "packages/create-supernuxt/deno.json",
]) {
  const manifest = JSON.parse(read(path));
  manifest.version = version;
  for (const name of internal) {
    if (manifest.dependencies?.[name]) manifest.dependencies[name] = version;
  }
  writeJson(path, manifest);
}

const skillPath = "skills/use-supernuxt/SKILL.md";
writeFileSync(
  new URL(skillPath, root),
  read(skillPath).replace(/^( {2}library_version:\s*)\S+\s*$/m, `$1${version}`),
);
console.log(`synced ${version}`);
