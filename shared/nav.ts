export interface StudioLink {
  href: string;
  label: string;
  group:
    "Studio" | "Data" | "Interface" | "Performance" | "Behavior" | "Tooling";
}

export const studioNav: StudioLink[] = [
  { href: "/studio", label: "Deck", group: "Studio" },
  { href: "/studio/query", label: "Query", group: "Data" },
  { href: "/studio/db", label: "DB", group: "Data" },
  { href: "/studio/store", label: "Store", group: "Data" },
  { href: "/studio/start", label: "Start", group: "Data" },
  { href: "/studio/ai", label: "AI", group: "Data" },
  { href: "/studio/table", label: "Table", group: "Interface" },
  { href: "/studio/charts", label: "Charts", group: "Interface" },
  { href: "/studio/form", label: "Form", group: "Interface" },
  { href: "/studio/ranger", label: "Ranger", group: "Interface" },
  { href: "/studio/virtual", label: "Virtual", group: "Performance" },
  { href: "/studio/pacer", label: "Pacer", group: "Performance" },
  { href: "/studio/hotkeys", label: "Hotkeys", group: "Behavior" },
  { href: "/studio/router", label: "Router", group: "Behavior" },
  { href: "/studio/prose", label: "Prose", group: "Behavior" },
  { href: "/studio/devtools", label: "Devtools", group: "Tooling" },
  { href: "/studio/rstack", label: "Rstack", group: "Tooling" },
];

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
