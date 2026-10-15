import { readFileSync } from "node:fs";
import { describe, expect, it } from "@rstest/core";

const mark = readFileSync(
  new URL("../public/brand/mark.svg", import.meta.url),
  "utf8",
);

describe("brand mark", () => {
  it("uses one svg for the favicon, the brand file, and the scaffolder", () => {
    const favicon = readFileSync(
      new URL("../public/favicon.svg", import.meta.url),
      "utf8",
    );
    const packaged = readFileSync(
      new URL("../packages/create-supernuxt/mark.svg", import.meta.url),
      "utf8",
    );
    expect(favicon).toBe(mark);
    expect(packaged).toBe(mark);
    expect(mark).toContain('fill="#009567"');
  });
});
