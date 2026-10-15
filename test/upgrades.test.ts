import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "@rstest/core";
import { dispatchServerFn } from "../packages/core/src/contracts";
import { orderDocs, parseDocSource } from "../packages/core/src/docs";
import { applyStatus, createLedger } from "../packages/core/src/ledger";
import { defineLayerConfig } from "../config/layer";
import {
  libraryVersion,
  readRelease,
  readScaffolderRelease,
} from "../packages/core/src/release";
import { listIntegrationIds } from "../packages/core/src/index";
import { hrefFor, studioPages } from "../shared/nav";
import { missions } from "../packages/core/src/missions";

const root = new URL("..", import.meta.url);

describe("layer entry", () => {
  it("points module and css at this package and names the layer", () => {
    const config = defineLayerConfig(
      new URL("../nuxt.config.ts", import.meta.url).href,
    );
    expect(config.$meta.name).toBe("supernuxt");
    expect(config.modules[1]).toBe("@supernuxt/nuxt");
    expect(config.css[0]).toMatch(/app\/assets\/css\/main\.css$/);
    expect(config.css[1]).toMatch(/app\/assets\/css\/studio\.css$/);
    expect(config).not.toHaveProperty("runtimeConfig");
  });
});

describe("release pin", () => {
  it("reads one version and one nuxt pin from the root package", () => {
    const rootPackage = readFileSync(
      new URL("../package.json", import.meta.url),
      "utf8",
    );
    const release = readRelease(rootPackage);
    const createPackage = readScaffolderRelease(
      readFileSync(
        new URL("../packages/create-supernuxt/package.json", import.meta.url),
        "utf8",
      ),
    );
    const jsr = JSON.parse(
      readFileSync(new URL("../jsr.json", import.meta.url), "utf8"),
    ) as {
      version: string;
    };
    const createJsr = JSON.parse(
      readFileSync(
        new URL("../packages/create-supernuxt/jsr.json", import.meta.url),
        "utf8",
      ),
    ) as { version: string };
    const deno = JSON.parse(
      readFileSync(new URL("../deno.json", import.meta.url), "utf8"),
    ) as {
      version: string;
    };
    const skill = readFileSync(
      new URL("../skills/use-supernuxt/SKILL.md", import.meta.url),
      "utf8",
    );
    expect(createPackage).toEqual(release);
    expect(jsr.version).toBe(release.version);
    expect(createJsr.version).toBe(release.version);
    expect(deno.version).toBe(release.version);
    expect(libraryVersion(skill)).toBe(release.version);
    expect(JSON.parse(rootPackage).exports["."]).toBe("./nuxt.config.ts");
    expect(JSON.parse(rootPackage).dependencies["@supernuxt/nuxt"]).toBe(
      release.version,
    );
  });
});

describe("mission ledger", () => {
  it("treats a repeated status as a no-op and shares that board with briefing", () => {
    const ledger = createLedger(missions);
    const first = ledger.apply({ id: "kite-4", status: "ascent" });
    const second = ledger.apply({ id: "kite-4", status: "ascent" });
    expect(first.ok && first.changed).toBe(true);
    expect(second.ok && second.changed).toBe(false);
    if (first.ok && second.ok) expect(second.mission).toBe(first.mission);
    const briefing = dispatchServerFn(
      "briefing",
      { missionId: "kite-4" },
      ledger.list(),
    );
    expect(briefing.ok && briefing.value.headline).toBe("KITE-4 is ascent");
    const sameBoard = applyStatus(ledger.list(), {
      id: "missing",
      status: "hold",
    });
    expect(sameBoard.result.ok).toBe(false);
    expect(sameBoard.board).toEqual(ledger.list());
  });
});

describe("studio atlas", () => {
  it("covers every catalog id exactly once", () => {
    const ids = studioPages.flatMap((page) => page.ids);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.sort()).toEqual(listIntegrationIds().sort());
    expect(hrefFor("markdown")).toBe("/studio/prose");
    expect(hrefFor("rspack")).toBe("/studio/rstack");
  });
});

describe("doc corpus", () => {
  it("builds the shipped pages from frontmatter", () => {
    const dir = join(root.pathname, "content/docs");
    const pages = orderDocs(
      readdirSync(dir)
        .filter((name) => name.endsWith(".md"))
        .map((name) =>
          parseDocSource(name, readFileSync(join(dir, name), "utf8")),
        ),
    );
    expect(pages[0]?.href).toBe("/docs");
    expect(pages.map((page) => page.slug)).toEqual([
      "architecture",
      "usage",
      "information",
    ]);
    expect(pages.map((page) => page.section)).toEqual([
      "Architecture",
      "Usage",
      "Information",
    ]);
  });
});
