export const docSections = [
  "Start",
  "Framework",
  "Integrations",
  "Ship",
] as const;

export type DocSection = (typeof docSections)[number];

export interface DocPage {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly section: DocSection;
  readonly order: number;
  readonly body: string;
}

export interface RspressSidebarItem {
  readonly text: string;
  readonly link: string;
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseDocSource(filename: string, source: string): DocPage {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match?.[1]) {
    throw new Error(`${filename} is missing frontmatter.`);
  }
  const fields = new Map<string, string>();
  for (const line of match[1].split("\n")) {
    const split = line.indexOf(":");
    if (split === -1) continue;
    fields.set(line.slice(0, split).trim(), unquote(line.slice(split + 1)));
  }
  const title = fields.get("title");
  const description = fields.get("description");
  const section = fields.get("section");
  const order = Number(fields.get("order"));
  if (!title || !description || !section || !Number.isInteger(order)) {
    throw new Error(
      `${filename} frontmatter needs title, description, section, and order.`,
    );
  }
  if (!docSections.includes(section as DocSection)) {
    throw new Error(`${filename} has an unknown section.`);
  }
  const slug = filename.replace(/\.md$/, "").split("/").pop() ?? filename;
  return {
    slug,
    href: slug === "introduction" ? "/docs" : `/docs/${slug}`,
    title,
    description,
    section: section as DocSection,
    order,
    body: source.slice(match[0].length),
  };
}

export function orderDocs(pages: readonly DocPage[]): DocPage[] {
  return [...pages].sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

export function rspressSidebar(
  pages: readonly DocPage[],
): RspressSidebarItem[] {
  return orderDocs(pages).map((page) => ({
    text: page.title,
    link:
      page.slug === "introduction"
        ? "/guide/introduction"
        : `/guide/${page.slug}`,
  }));
}

export function rewriteDocLinks(markdown: string): string {
  return markdown
    .replaceAll("](/docs/", "](/guide/")
    .replaceAll("](/docs)", "](/guide/introduction)");
}
