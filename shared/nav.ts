import { rstackTools, tanstackLibraries } from "../src/index";

export interface StudioLink {
  href: string;
  label: string;
  group:
    "Studio" | "Data" | "Interface" | "Performance" | "Behavior" | "Tooling";
}

export interface StudioPage extends StudioLink {
  ids: readonly string[];
}

const toolingIds = [
  ...tanstackLibraries
    .filter((entry) => entry.kind === "tooling")
    .map((entry) => entry.id),
  ...rstackTools.map((entry) => entry.id),
];

export const studioPages: readonly StudioPage[] = [
  { href: "/studio", label: "Deck", group: "Studio", ids: [] },
  { href: "/studio/query", label: "Query", group: "Data", ids: ["query"] },
  { href: "/studio/db", label: "DB", group: "Data", ids: ["db"] },
  { href: "/studio/store", label: "Store", group: "Data", ids: ["store"] },
  { href: "/studio/start", label: "Functions", group: "Data", ids: ["start"] },
  { href: "/studio/ai", label: "AI", group: "Data", ids: ["ai"] },
  { href: "/studio/table", label: "Table", group: "Interface", ids: ["table"] },
  {
    href: "/studio/charts",
    label: "Charts",
    group: "Interface",
    ids: ["charts"],
  },
  { href: "/studio/form", label: "Form", group: "Interface", ids: ["form"] },
  {
    href: "/studio/ranger",
    label: "Ranger",
    group: "Interface",
    ids: ["ranger"],
  },
  {
    href: "/studio/virtual",
    label: "Virtual",
    group: "Performance",
    ids: ["virtual"],
  },
  {
    href: "/studio/pacer",
    label: "Pacer",
    group: "Performance",
    ids: ["pacer"],
  },
  {
    href: "/studio/hotkeys",
    label: "Hotkeys",
    group: "Behavior",
    ids: ["hotkeys"],
  },
  {
    href: "/studio/router",
    label: "Router",
    group: "Behavior",
    ids: ["router"],
  },
  {
    href: "/studio/prose",
    label: "Prose",
    group: "Behavior",
    ids: ["markdown", "highlight"],
  },
  {
    href: "/studio/devtools",
    label: "Devtools",
    group: "Tooling",
    ids: ["devtools"],
  },
  {
    href: "/studio/rstack",
    label: "Rstack",
    group: "Tooling",
    ids: toolingIds,
  },
];

export const studioNav: StudioLink[] = studioPages.map(
  ({ href, label, group }) => ({
    href,
    label,
    group,
  }),
);

export function hrefFor(id: string): string {
  return (
    studioPages.find((page) => page.ids.includes(id))?.href ?? "/studio/rstack"
  );
}

export const navGroups = [
  "Studio",
  "Data",
  "Interface",
  "Performance",
  "Behavior",
  "Tooling",
] as const;

export const installCommands = [
  { id: "npm", label: "npm", command: "npm create supernuxt@latest" },
  { id: "pnpm", label: "pnpm", command: "pnpm create supernuxt" },
  { id: "bun", label: "bun", command: "bunx create-supernuxt" },
  { id: "npx", label: "npx", command: "npx create-supernuxt@latest" },
  { id: "deno", label: "deno", command: "deno run -A jsr:@supernuxt/create" },
] as const;
