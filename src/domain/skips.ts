/**
 * Packages this PR does not add, and the fact each reason was checked against.
 * vite-pwa is not described as incompatible with the Nuxt app builder.
 */
export interface SkipEntry {
  readonly packageName: string;
  readonly reason: string;
}

export const skippedPackages: readonly SkipEntry[] = [
  {
    packageName: "pinia",
    reason:
      "@tanstack/vue-store is already a direct dependency and is the client store.",
  },
  {
    packageName: "vee-validate",
    reason:
      "@tanstack/vue-form is already a direct dependency and is the form library.",
  },
  {
    packageName: "@nuxt/eslint",
    reason:
      "The repository lints with Rslint through `rs lint` and `define.lint` in rstack.config.ts.",
  },
  {
    packageName: "ai",
    reason:
      "@tanstack/ai and @tanstack/ai-vue are already direct dependencies. The Vercel AI SDK package name is `ai`.",
  },
  {
    packageName: "@ai-sdk/vue",
    reason:
      "Vue bindings for the Vercel AI SDK overlap @tanstack/ai-vue, which is already a direct dependency.",
  },
  {
    packageName: "vite-plugin-pwa",
    reason:
      "vite-pwa is out of scope for this module set. See vitePwaSkipReason.",
  },
];

/**
 * Verified from rstack.config.ts and package.json, not assumed.
 * `define.app` builds `./rstack/index.ts` into `public/rstack-console`.
 * The Nuxt app is built by the `nuxt build` script, and Nuxt 4's app builder is Vite.
 * A Vite PWA plugin could attach to that app build. It would not cover the Rstack console.
 * It is omitted because this change set excludes it, not because the Nuxt app is non-Vite.
 */
export function vitePwaSkipReason(): string {
  return [
    "rstack.config.ts define.app builds ./rstack/index.ts into public/rstack-console (the side console).",
    "package.json builds the Nuxt app with `nuxt build`. Nuxt 4 uses Vite for that app.",
    "vite-pwa is a Vite plugin, so it is not incompatible with the Nuxt app builder.",
    "It is omitted because a Vite-only PWA plugin would not cover the Rstack console and this module set excludes it.",
  ].join(" ");
}
