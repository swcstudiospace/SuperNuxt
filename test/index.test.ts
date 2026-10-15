import { describe, expect, it } from "@rstest/core";
import {
  assertServerFnName,
  listIntegrationIds,
  rstackTools,
  tanstackLibraries,
} from "../packages/core/src/index";

describe("supernuxt catalog", () => {
  it("lists every TanStack library from the public catalog", () => {
    expect(tanstackLibraries.map((entry) => entry.id)).toEqual([
      "start",
      "router",
      "query",
      "db",
      "store",
      "ai",
      "table",
      "charts",
      "form",
      "hotkeys",
      "markdown",
      "highlight",
      "virtual",
      "pacer",
      "ranger",
      "devtools",
      "config",
      "cli",
      "intent",
    ]);
  });

  it("lists the Rstack toolchain", () => {
    expect(rstackTools.map((entry) => entry.id)).toEqual([
      "rspack",
      "rsbuild",
      "rslib",
      "rspress",
      "rsdoctor",
      "rstest",
      "rslint",
      "rstack",
    ]);
  });

  it("returns unique integration ids", () => {
    const ids = listIntegrationIds();
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(tanstackLibraries.length + rstackTools.length);
  });

  it("briefs a known mission without calling a provider", async () => {
    const { composeDeskReply } =
      await import("../packages/core/src/desk-reply");
    const { missions } = await import("../packages/core/src/missions");
    expect(composeDeskReply("status of kite-4", missions)).toContain("KITE-4");
    expect(composeDeskReply("", missions)).toContain("Desk is listening");
  });

  it("accepts server function names and rejects empty labels", () => {
    expect(assertServerFnName("briefing")).toBe("briefing");
    expect(() => assertServerFnName("Briefing")).toThrow(/lowercase/);
    expect(() => assertServerFnName("")).toThrow(/lowercase/);
  });
});
