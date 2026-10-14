export type IntegrationKind = "runtime" | "bridge" | "tooling";

export interface StackEntry {
  id: string;
  name: string;
  kind: IntegrationKind;
  group: string;
  packageName: string | null;
  summary: string;
}

export const tanstackLibraries = [
  {
    id: "start",
    name: "TanStack Start",
    kind: "bridge",
    group: "Framework",
    packageName: null,
    summary:
      "Start targets React and Solid. SuperNuxt maps its server-function idea onto Nitro handlers.",
  },
  {
    id: "router",
    name: "TanStack Router",
    kind: "runtime",
    group: "Framework",
    packageName: "@tanstack/vue-router",
    summary:
      "Type-safe routes, loaders, and search params run as an island beside Nuxt file routes.",
  },
  {
    id: "query",
    name: "TanStack Query",
    kind: "runtime",
    group: "Data",
    packageName: "@tanstack/vue-query",
    summary: "Server state with Nuxt SSR dehydrate and hydrate.",
  },
  {
    id: "db",
    name: "TanStack DB",
    kind: "runtime",
    group: "Data",
    packageName: "@tanstack/vue-db",
    summary: "Client collections and live queries over mission records.",
  },
  {
    id: "store",
    name: "TanStack Store",
    kind: "runtime",
    group: "Data",
    packageName: "@tanstack/vue-store",
    summary: "Immutable client store for deck preferences.",
  },
  {
    id: "ai",
    name: "TanStack AI",
    kind: "runtime",
    group: "Data",
    packageName: "@tanstack/ai-vue",
    summary: "Chat client bound to a local Nitro stream, no API key required.",
  },
  {
    id: "table",
    name: "TanStack Table",
    kind: "runtime",
    group: "Interface",
    packageName: "@tanstack/vue-table",
    summary: "Headless sortable mission table.",
  },
  {
    id: "charts",
    name: "TanStack Charts",
    kind: "runtime",
    group: "Interface",
    packageName: "@tanstack/charts",
    summary: "Typed chart grammar rendered with the Vue adapter.",
  },
  {
    id: "form",
    name: "TanStack Form",
    kind: "runtime",
    group: "Interface",
    packageName: "@tanstack/vue-form",
    summary: "Headless flight-note form with field validation.",
  },
  {
    id: "hotkeys",
    name: "TanStack Hotkeys",
    kind: "runtime",
    group: "Interface",
    packageName: "@tanstack/vue-hotkeys",
    summary: "Shortcut registry for the studio shell.",
  },
  {
    id: "markdown",
    name: "TanStack Markdown",
    kind: "runtime",
    group: "Interface",
    packageName: "@tanstack/markdown",
    summary: "Serializable markdown model rendered in the prose lab.",
  },
  {
    id: "highlight",
    name: "TanStack Highlight",
    kind: "runtime",
    group: "Interface",
    packageName: "@tanstack/highlight",
    summary: "Synchronous syntax highlighting for lab samples.",
  },
  {
    id: "virtual",
    name: "TanStack Virtual",
    kind: "runtime",
    group: "Performance",
    packageName: "@tanstack/vue-virtual",
    summary: "Windowed telemetry log.",
  },
  {
    id: "pacer",
    name: "TanStack Pacer",
    kind: "runtime",
    group: "Performance",
    packageName: "@tanstack/vue-pacer",
    summary: "Debounce and rate limit on the comms panel.",
  },
  {
    id: "ranger",
    name: "TanStack Ranger",
    kind: "runtime",
    group: "Performance",
    packageName: "@tanstack/ranger",
    summary: "Headless range control for the delta-v window.",
  },
  {
    id: "devtools",
    name: "TanStack Devtools",
    kind: "runtime",
    group: "Tooling",
    packageName: "@tanstack/vue-devtools",
    summary: "Unified devtools dock plus Vue Query devtools.",
  },
  {
    id: "config",
    name: "TanStack Config",
    kind: "tooling",
    group: "Tooling",
    packageName: "@tanstack/config",
    summary: "Publish and package tooling kept on the framework dev toolchain.",
  },
  {
    id: "cli",
    name: "TanStack CLI",
    kind: "tooling",
    group: "Tooling",
    packageName: "@tanstack/cli",
    summary: "TanStack project CLI available as a local binary.",
  },
  {
    id: "intent",
    name: "TanStack Intent",
    kind: "tooling",
    group: "Tooling",
    packageName: "@tanstack/intent",
    summary: "Agent skill shipped with the framework package.",
  },
] as const satisfies readonly StackEntry[];

export const rstackTools = [
  {
    id: "rspack",
    name: "Rspack",
    kind: "tooling",
    group: "Rstack",
    packageName: "@rspack/core",
    summary: "Rust bundler underneath Rsbuild, Rslib, Rstest, and Rspress.",
  },
  {
    id: "rsbuild",
    name: "Rsbuild",
    kind: "tooling",
    group: "Rstack",
    packageName: "@rsbuild/core",
    summary: "Builds the static Rstack console embedded in the studio.",
  },
  {
    id: "rslib",
    name: "Rslib",
    kind: "tooling",
    group: "Rstack",
    packageName: "@rslib/core",
    summary: "Bundles the SuperNuxt core library.",
  },
  {
    id: "rspress",
    name: "Rspress",
    kind: "tooling",
    group: "Rstack",
    packageName: "@rspress/core",
    summary: "Docs site for the framework.",
  },
  {
    id: "rsdoctor",
    name: "Rsdoctor",
    kind: "tooling",
    group: "Rstack",
    packageName: "@rsdoctor/core",
    summary: "Build analysis for the Rsbuild console.",
  },
  {
    id: "rstest",
    name: "Rstest",
    kind: "tooling",
    group: "Rstack",
    packageName: "@rstest/core",
    summary: "Test runner for the core library.",
  },
  {
    id: "rslint",
    name: "Rslint",
    kind: "tooling",
    group: "Rstack",
    packageName: "@rslint/core",
    summary: "Linter for the repository.",
  },
  {
    id: "rstack",
    name: "Rstack CLI",
    kind: "tooling",
    group: "Rstack",
    packageName: "rstack",
    summary: "One CLI for build, test, lint, format, lib, and docs.",
  },
] as const satisfies readonly StackEntry[];

const serverFnName = /^[a-z][a-z0-9-]*$/;

export function assertServerFnName(name: string): string {
  if (!serverFnName.test(name)) {
    throw new Error(
      `Server function names use lowercase letters, numbers, and hyphens: received "${name}".`,
    );
  }
  return name;
}

export function listIntegrationIds(): string[] {
  return [...tanstackLibraries, ...rstackTools].map((entry) => entry.id);
}
