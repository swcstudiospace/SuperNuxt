import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "@rstest/core";
import { scaffold } from "../packages/create-supernuxt/index.mjs";

describe("create-supernuxt", () => {
  it("writes a bare app that carries the same logo", async () => {
    const dir = await mkdtemp(join(tmpdir(), "supernuxt-"));
    try {
      const result = await scaffold({
        dir,
        framework: "file:..",
        force: true,
      });
      const mark = await readFile(
        new URL("../public/brand/mark.svg", import.meta.url),
        "utf8",
      );
      const favicon = await readFile(
        join(result.target, "public/favicon.svg"),
        "utf8",
      );
      const pkg = JSON.parse(
        await readFile(join(result.target, "package.json"), "utf8"),
      );
      const config = await readFile(
        join(result.target, "nuxt.config.ts"),
        "utf8",
      );
      expect(favicon).toBe(mark);
      expect(pkg.dependencies.supernuxt).toBe("file:..");
      expect(config).toContain('extends: ["supernuxt"]');
      expect(result.files).toContain("app/app.vue");
      expect(result.files).not.toContain("app/pages/index.vue");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
