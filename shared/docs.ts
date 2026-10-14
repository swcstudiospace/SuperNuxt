import branding from "../content/docs/branding.md?raw";
import deno from "../content/docs/deno.md?raw";
import installation from "../content/docs/installation.md?raw";
import introduction from "../content/docs/introduction.md?raw";
import moduleDoc from "../content/docs/module.md?raw";
import publish from "../content/docs/publish.md?raw";
import rstack from "../content/docs/rstack.md?raw";
import serverFunctions from "../content/docs/server-functions.md?raw";
import tanstack from "../content/docs/tanstack.md?raw";

export const docSections = [
  "Start",
  "Framework",
  "Integrations",
  "Ship",
] as const;

export interface DocPage {
  slug: string;
  href: string;
  title: string;
  description: string;
  section: (typeof docSections)[number];
  body: string;
}

export const docPages: DocPage[] = [
  {
    slug: "introduction",
    href: "/docs",
    title: "Introduction",
    description:
      "What SuperNuxt is and where the landing page, docs, and studio live.",
    section: "Start",
    body: introduction,
  },
  {
    slug: "installation",
    href: "/docs/installation",
    title: "Installation",
    description: "Create an app with npm, pnpm, Bun, npx, or Deno.",
    section: "Start",
    body: installation,
  },
  {
    slug: "module",
    href: "/docs/module",
    title: "Module",
    description:
      "Extend the layer or register the module, and the options it accepts.",
    section: "Framework",
    body: moduleDoc,
  },
  {
    slug: "branding",
    href: "/docs/branding",
    title: "Branding",
    description: "The single emerald mark, the wordmark, and the color tokens.",
    section: "Framework",
    body: branding,
  },
  {
    slug: "tanstack",
    href: "/docs/tanstack",
    title: "TanStack",
    description:
      "Every TanStack bench in the studio and the packages that stay on the toolchain.",
    section: "Integrations",
    body: tanstack,
  },
  {
    slug: "server-functions",
    href: "/docs/server-functions",
    title: "Server functions",
    description: "How useServerFn calls a named Nitro handler.",
    section: "Integrations",
    body: serverFunctions,
  },
  {
    slug: "rstack",
    href: "/docs/rstack",
    title: "Rstack",
    description:
      "Rspack, Rsbuild, Rslib, Rspress, Rsdoctor, Rstest, Rslint, and the CLI.",
    section: "Integrations",
    body: rstack,
  },
  {
    slug: "deno",
    href: "/docs/deno",
    title: "Deno",
    description: "Deno tasks, JSR package names, and how the scaffolder runs.",
    section: "Ship",
    body: deno,
  },
  {
    slug: "publish",
    href: "/docs/publish",
    title: "Publish",
    description:
      "npm and JSR package names for the framework and the scaffolder.",
    section: "Ship",
    body: publish,
  },
];

export function findDoc(slug: string): DocPage | undefined {
  return docPages.find((page) => page.slug === slug);
}

export function neighbors(slug: string): {
  previous?: DocPage;
  next?: DocPage;
} {
  const index = docPages.findIndex((page) => page.slug === slug);
  return {
    previous: index > 0 ? docPages[index - 1] : undefined,
    next: index >= 0 ? docPages[index + 1] : undefined,
  };
}
