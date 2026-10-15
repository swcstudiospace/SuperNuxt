import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
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
      expect(pkg.dependencies["@swcstudio/supernuxt"]).toBe("file:..");
      expect(config).toContain('extends: ["@swcstudio/supernuxt"]');
      expect(result.files).toContain("app/app.vue");
      expect(result.files).not.toContain("app/pages/index.vue");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("runs when launched through a .bin-style symlink", async () => {
    const dir = await mkdtemp(join(tmpdir(), "supernuxt-bin-"));
    try {
      const entry = fileURLToPath(
        new URL("../packages/create-supernuxt/index.mjs", import.meta.url),
      );
      const link = join(dir, "create-supernuxt");
      await symlink(entry, link);
      const out = execFileSync(process.execPath, [link, "--help"], {
        encoding: "utf8",
      });
      expect(out).toContain("SuperNuxt scaffolder");
      execFileSync(
        process.execPath,
        [link, "--dir", join(dir, "app"), "--framework", "file:.."],
        { encoding: "utf8" },
      );
      const pkg = JSON.parse(
        await readFile(join(dir, "app", "package.json"), "utf8"),
      );
      expect(pkg.dependencies["@swcstudio/supernuxt"]).toBe("file:..");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
