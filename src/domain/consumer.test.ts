import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "@rstest/core";
import { loadNuxt } from "@nuxt/kit";

const root = new URL("../..", import.meta.url);
const rootPath = fileURLToPath(root);

describe("published layer", () => {
  it("ships the sentry and content configs in the npm package", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("package.json", root), "utf8"),
    ) as { files: string[] };
    for (const file of [
      "content.config.ts",
      "sentry.client.config.ts",
      "sentry.server.config.ts",
    ]) {
      expect(pkg.files).toContain(file);
      expect(readFileSync(new URL(file, root), "utf8").length).toBeGreaterThan(
        0,
      );
    }
  });

  it("keeps a consumer's image and i18n settings and publishes the sentry DSN", async () => {
    const dir = await mkdtemp(join(rootPath, ".consumer-test-"));
    const dsn = "https://public@o0.ingest.sentry.io/1";
    const previous = process.env.SENTRY_DSN;
    process.env.SENTRY_DSN = dsn;
    try {
      await writeFile(
        join(dir, "nuxt.config.ts"),
        `export default defineNuxtConfig({
  extends: [${JSON.stringify(rootPath)}],
  telemetry: false,
  compatibilityDate: "2026-10-14",
  image: { domains: ["cdn.example.test"] },
  i18n: { strategy: "prefix" },
  security: { headers: { xFrameOptions: "DENY" } },
  supernuxt: {
    fonts: false,
    seo: false,
    scripts: false,
    hints: false,
    devtools: false,
    auth: false,
    content: false,
  },
})
`,
      );
      const nuxt = await loadNuxt({ cwd: dir, ready: true });
      try {
        const image = nuxt.options.image as {
          domains?: string[];
          provider?: string;
        };
        expect(image.domains).toContain("cdn.example.test");
        expect(image.provider).toBe("ipx");
        const i18n = nuxt.options.i18n as { strategy?: string };
        expect(i18n.strategy).toBe("prefix");
        const sentryDsn = (
          nuxt.options.runtimeConfig.public as { sentryDsn?: string }
        ).sentryDsn;
        expect(sentryDsn).toBe(dsn);
        const connect = nuxt.options.security?.headers?.contentSecurityPolicy?.[
          "connect-src"
        ] as string[] | undefined;
        expect(connect).toContain("https://o0.ingest.sentry.io");
        expect(connect).toContain("'self'");
        expect(nuxt.options.security?.headers?.xFrameOptions).toBe("DENY");
        const names = nuxt.options._installedModules.map(
          (item) => item.meta?.name,
        );
        expect(names).toContain("@sentry/nuxt/module");
        expect(names).not.toContain("@nuxt/content");
      } finally {
        await nuxt.close();
      }
    } finally {
      if (previous === undefined) delete process.env.SENTRY_DSN;
      else process.env.SENTRY_DSN = previous;
      await rm(dir, { recursive: true, force: true });
    }
  });
});
