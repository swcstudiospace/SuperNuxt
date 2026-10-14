export interface StudioLink {
  href: string;
  label: string;
  group:
    "Studio" | "Data" | "Interface" | "Performance" | "Behavior" | "Tooling";
}

export const studioNav: StudioLink[] = [
  { href: "/", label: "Deck", group: "Studio" },
  { href: "/query", label: "Query", group: "Data" },
  { href: "/db", label: "DB", group: "Data" },
  { href: "/store", label: "Store", group: "Data" },
  { href: "/start", label: "Start", group: "Data" },
  { href: "/ai", label: "AI", group: "Data" },
  { href: "/table", label: "Table", group: "Interface" },
  { href: "/charts", label: "Charts", group: "Interface" },
  { href: "/form", label: "Form", group: "Interface" },
  { href: "/ranger", label: "Ranger", group: "Interface" },
  { href: "/virtual", label: "Virtual", group: "Performance" },
  { href: "/pacer", label: "Pacer", group: "Performance" },
  { href: "/hotkeys", label: "Hotkeys", group: "Behavior" },
  { href: "/router", label: "Router", group: "Behavior" },
  { href: "/prose", label: "Prose", group: "Behavior" },
  { href: "/devtools", label: "Devtools", group: "Tooling" },
  { href: "/rstack", label: "Rstack", group: "Tooling" },
];

export const navGroups = [
  "Studio",
  "Data",
  "Interface",
  "Performance",
  "Behavior",
  "Tooling",
] as const;
