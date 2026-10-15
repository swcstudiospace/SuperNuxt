import { define } from "rstack";

define.app({
  source: {
    entry: {
      index: "./rstack/index.ts",
    },
  },
  output: {
    distPath: {
      root: "public/rstack-console",
    },
    assetPrefix: "/rstack-console/",
  },
  html: {
    title: "SuperNuxt Rstack console",
  },
  server: {
    port: 47831,
    host: "127.0.0.1",
    publicDir: false,
  },
});

define.lib({
  lib: [
    {
      format: "esm",
      dts: false,
      syntax: "es2022",
    },
  ],
  source: {
    entry: {
      index: "./packages/core/src/index.ts",
    },
  },
});

define.test({
  include: ["test/**/*.test.ts"],
  testEnvironment: "node",
});

define.lint([
  {
    ignores: [
      "**/.nuxt/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/public/rstack/**",
      "**/public/rstack-console/**",
      "**/.output/**",
      "**/.planning/**",
      "**/.claude/**",
    ],
  },
]);

define.fmt({
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  ignorePatterns: [
    "public/rstack/**",
    "public/rstack-console/**",
    ".nuxt/**",
    "dist/**",
    ".output/**",
    ".planning/**",
    ".claude/**",
    "packages/*/dist/**",
  ],
});
