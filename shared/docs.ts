import { orderDocs, parseDocSource, type DocPage } from "../src/domain/docs";

const rawDocs = import.meta.glob("../content/docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const docPages: DocPage[] = orderDocs(
  Object.entries(rawDocs).map(([path, source]) => {
    const filename = path.split("/").pop() ?? path;
    return parseDocSource(filename, source);
  }),
);

export { docSections } from "../src/domain/docs";

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
    next:
      index >= 0 && index < docPages.length - 1
        ? docPages[index + 1]
        : undefined,
  };
}
