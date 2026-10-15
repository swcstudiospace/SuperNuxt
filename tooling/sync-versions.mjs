#!/usr/bin/env node
// Copies the root package version into every workspace manifest, every
// deno.json that JSR publishes, internal dependency pins and the agent skill.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const writeJson = (path, value) =>
  writeFileSync(new URL(path, root), `${JSON.stringify(value, null, 2)}\n`);

const version = JSON.parse(read("package.json")).version;
const internal = ["@supernuxt/core", "@supernuxt/nuxt"];

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
