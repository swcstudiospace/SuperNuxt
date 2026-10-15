import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { rstackTools, tanstackLibraries } from "@supernuxt/core";

const require = createRequire(import.meta.url);

function readVersion(pkgPath: string, name: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
      name?: string;
      version?: string;
    };
    if (pkg.name === name && pkg.version) return pkg.version;
  } catch {
    return null;
  }
  return null;
}

function versionOf(name: string): string | null {
  const installed = join(process.cwd(), "node_modules", name, "package.json");
  const direct = readVersion(installed, name);
  if (direct) return direct;

  try {
    const resolved = require.resolve(name);
    let dir = dirname(resolved);
    for (let depth = 0; depth < 8; depth += 1) {
      const found = readVersion(join(dir, "package.json"), name);
      if (found) return found;
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch {
    return null;
  }
  return null;
}

export default defineEventHandler(() => {
  const entries = [...tanstackLibraries, ...rstackTools].map((entry) => ({
    ...entry,
    version: entry.packageName ? versionOf(entry.packageName) : null,
  }));

  return {
    nuxt: versionOf("nuxt"),
    vue: versionOf("vue"),
    consoleBuilt: existsSync(
      join(process.cwd(), "public/rstack-console/index.html"),
    ),
    entries,
  };
});
