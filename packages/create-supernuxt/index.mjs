#!/usr/bin/env node
// @ts-self-types="./index.d.mts"
import { readFileSync } from "node:fs";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const scaffolderPackage = JSON.parse(
  readFileSync(join(here, "package.json"), "utf8"),
);
const version = scaffolderPackage.version;
const nuxtPin = scaffolderPackage.supernuxt.nuxt;

const help = `SuperNuxt scaffolder ${version}

Usage
  npm create supernuxt@latest [dir]
  pnpm create supernuxt [dir]
  bunx create-supernuxt [dir]
  npx create-supernuxt@latest [dir]
  npx supernuxt [dir]
  deno run -A jsr:@supernuxt/create [dir]

Options
  --dir <path>     Target directory (default: supernuxt-app)
  --pm <name>      npm, pnpm, bun, or deno. Prints matching commands.
  --framework <p>  Dependency spec for supernuxt (default: ^<version>)
  --force          Write into a directory that already has files
  --yes            Accepted for non-interactive runners
  --help           Show this message
`;

function parseArgs(argv) {
  const options = {
    dir: "",
    pm: "",
    framework: `^${version}`,
    force: false,
    help: false,
  };
  const positionals = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--yes" || arg === "-y") continue;
    else if (arg === "--force") options.force = true;
    else if (arg === "--dir") options.dir = argv[(index += 1)] ?? "";
    else if (arg === "--pm") options.pm = argv[(index += 1)] ?? "";
    else if (arg === "--framework")
      options.framework = argv[(index += 1)] ?? options.framework;
    else if (arg.startsWith("-")) throw new Error(`Unknown option ${arg}`);
    else positionals.push(arg);
  }
  if (!options.dir) options.dir = positionals[0] || "supernuxt-app";
  return options;
}

function packageManager(name) {
  if (name === "pnpm") return { install: "pnpm install", dev: "pnpm dev" };
  if (name === "bun") return { install: "bun install", dev: "bun run dev" };
  if (name === "deno") return { install: "deno install", dev: "deno task dev" };
  return { install: "npm install", dev: "npm run dev" };
}

function files(framework, name) {
  return {
    "package.json": `${JSON.stringify(
      {
        name,
        private: true,
        type: "module",
        scripts: {
          dev: "nuxt dev",
          build: "nuxt build",
          preview: "nuxt preview",
          postinstall: "nuxt prepare",
        },
        dependencies: {
          nuxt: nuxtPin,
          supernuxt: framework,
          vue: "^3.5.22",
          "vue-router": "^4.5.1",
        },
      },
      null,
      2,
    )}\n`,
    "nuxt.config.ts": `export default defineNuxtConfig({
  extends: ["supernuxt"],
  telemetry: false,
  compatibilityDate: "2026-10-14",
  supernuxt: {
    staleTime: 30_000,
    queryDevtools: true,
  },
});
`,
    "app/app.vue": `<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
`,
    "tsconfig.json": `{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
`,
    ".gitignore": `node_modules
.nuxt
.output
dist
.DS_Store
`,
    ".nuxtrc": `telemetry.enabled=false
`,
    "deno.json": `{
  "nodeModulesDir": "auto",
  "tasks": {
    "dev": "deno run -A npm:nuxt@${nuxtPin} dev",
    "build": "deno run -A npm:nuxt@${nuxtPin} build",
    "preview": "deno run -A npm:nuxt@${nuxtPin} preview"
  }
}
`,
    "README.md": `# SuperNuxt app

This app extends the SuperNuxt layer. The landing page and documentation site come from the framework.

\`\`\`bash
npm install
npm run dev
\`\`\`

Other package managers:

\`\`\`bash
pnpm install && pnpm dev
bun install && bun run dev
deno install && deno task dev
\`\`\`

Replace \`app/pages/index.vue\` when you are ready for your own home page. Until then, \`/\` is the SuperNuxt landing page and \`/docs\` is the documentation.
`,
  };
}

export async function scaffold(options) {
  const target = resolve(options.dir);
  try {
    await access(target);
    if (!options.force) {
      const existing = await import("node:fs/promises").then((fs) =>
        fs.readdir(target),
      );
      if (existing.length > 0) {
        throw new Error(
          `${target} is not empty. Pass --force to write anyway.`,
        );
      }
    }
  } catch (error) {
    if (error && error.code !== "ENOENT") throw error;
  }

  const mark = await readFile(join(here, "mark.svg"), "utf8");
  const name =
    basename(target)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "") || "supernuxt-app";
  const written = files(options.framework || `^${version}`, name);
  written["public/favicon.svg"] = mark;

  await mkdir(target, { recursive: true });
  for (const [name, contents] of Object.entries(written)) {
    const path = join(target, name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, contents);
  }
  return { target, files: Object.keys(written) };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(help);
    return;
  }
  const result = await scaffold(options);
  const commands = packageManager(options.pm || "npm");
  process.stdout.write(`Created ${result.target}\n`);
  process.stdout.write(
    `Next:\n  cd ${options.dir}\n  ${commands.install}\n  ${commands.dev}\n`,
  );
}

const invoked =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (invoked) {
  main().catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
