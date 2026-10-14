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
      index: "./src/index.ts",
    },
  },
});

define.test({
  include: ["src/**/*.test.ts"],
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
      "**/docs/.rspress/**",
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
  ],
});

define.doc({
  root: "docs",
  title: "SuperNuxt",
  description: "Nuxt 4 with TanStack and the Rstack toolchain.",
  themeConfig: {
    nav: [{ text: "Guide", link: "/guide/install" }],
    sidebar: {
      "/guide/": [
        { text: "Install", link: "/guide/install" },
        { text: "TanStack", link: "/guide/tanstack" },
        { text: "Rstack", link: "/guide/rstack" },
      ],
    },
  },
});
