import { readFileSync } from "node:fs";
import { describe, expect, it } from "@rstest/core";
import {
  activateAuth,
  bootAuth,
  createAuthState,
  handleAuthRequest,
} from "./auth";
import { isPostgresUrl, presentEnv, readModuleEnv } from "./env";
import {
  disabledFontProviders,
  installedModules,
  legacyDocsRenderer,
  modulePackageNames,
  resolveModulePlan,
} from "./modules";
import { parseSuperNuxtOptions, superNuxtDefaults } from "./options";
import {
  assertClosedCsp,
  contentSecurityPolicy,
  devOnlyCspTokens,
  securityModuleOptions,
  sentryConnectOrigin,
} from "./security";
import { initSentry, planSentry } from "./sentry";
import { skippedPackages, vitePwaSkipReason } from "./skips";

const root = new URL("../..", import.meta.url);

function plan(
  overrides: Partial<ReturnType<typeof parseSuperNuxtOptions>> = {},
  env: Record<string, string | undefined> = {},
  dev = false,
  securityEnabled?: boolean,
) {
  return resolveModulePlan(
    parseSuperNuxtOptions({ ...superNuxtDefaults, ...overrides }),
    readModuleEnv(env),
    { dev, securityEnabled },
  );
}

describe("module opt-out", () => {
  it("enables tier 1 and security, and leaves auth, sentry, and content inert", () => {
    const resolved = plan();
    expect(installedModules(resolved)).toEqual([
      modulePackageNames.image,
      modulePackageNames.fonts,
      modulePackageNames.i18n,
      modulePackageNames.seo,
      modulePackageNames.scripts,
      modulePackageNames.hints,
      modulePackageNames.security,
    ]);
    expect(resolved.auth).toMatchObject({
      registerRoute: false,
      connect: false,
      reason: "disabled",
    });
    expect(resolved.sentry.install).toBe(false);
    expect(resolved.content.install).toBe(false);
    expect(resolved.content.legacyRenderer).toEqual(legacyDocsRenderer);
  });

  it.each([
    ["image", modulePackageNames.image],
    ["fonts", modulePackageNames.fonts],
    ["seo", modulePackageNames.seo],
    ["scripts", modulePackageNames.scripts],
    ["i18n", modulePackageNames.i18n],
    ["hints", modulePackageNames.hints],
    ["security", modulePackageNames.security],
  ] as const)("drops %s when its flag is false", (flag, moduleName) => {
    const resolved = plan({ [flag]: false });
    expect(installedModules(resolved)).not.toContain(moduleName);
    expect(resolved.nuxtOptions).not.toHaveProperty(
      flag === "seo" ? "nuxtseo" : flag,
    );
  });

  it("keeps the image provider local", () => {
    const resolved = plan();
    expect(resolved.nuxtOptions.image).toEqual({ provider: "ipx" });
  });

  it("disables every remote font provider", () => {
    const resolved = plan();
    expect(resolved.fontProviders).toEqual(disabledFontProviders);
    expect(
      Object.values(resolved.fontProviders).every((value) => value === false),
    ).toBe(true);
    const fonts = resolved.nuxtOptions.fonts as {
      providers: typeof disabledFontProviders;
      processCSSVariables: boolean;
    };
    expect(fonts.processCSSVariables).toBe(false);
  });

  it("ships an empty script registry and no third-party hosts", () => {
    const resolved = plan();
    expect(resolved.scriptsRegistry).toEqual({});
    expect(JSON.stringify(resolved.nuxtOptions.scripts)).not.toMatch(/https?:/);
  });

  it("keeps i18n on the existing paths", () => {
    const resolved = plan();
    const i18n = resolved.nuxtOptions.i18n as {
      strategy: string;
      detectBrowserLanguage: boolean;
    };
    expect(i18n.strategy).toBe("no_prefix");
    expect(i18n.detectBrowserLanguage).toBe(false);
  });

  it("turns SEO features off individually and disables the crawler", () => {
    const resolved = plan({ sitemap: false, robots: false, ogImage: false });
    expect(installedModules(resolved)).toContain(modulePackageNames.seo);
    expect(resolved.nuxtOptions.sitemap).toEqual({ enabled: false });
    expect(resolved.nuxtOptions.robots).toEqual({ enabled: false });
    expect(resolved.nuxtOptions.ogImage).toEqual({
      enabled: false,
      zeroRuntime: true,
    });
    expect(resolved.nuxtOptions.linkChecker).toEqual({ enabled: false });
    expect(resolved.nuxtOptions.skewProtection).toBe(false);
  });

  it("honors security.enabled false and omits the module when the flag is false", () => {
    const disabledFlag = plan({ security: false });
    expect(installedModules(disabledFlag)).not.toContain("nuxt-security");
    expect(disabledFlag.security).toBeNull();

    const honored = plan({}, {}, false, false);
    expect(installedModules(honored)).toContain("nuxt-security");
    expect(honored.security?.enabled).toBe(false);
  });

  it("ships a closed production CSP and a dev CSP that can reach local devtools", () => {
    const production = contentSecurityPolicy(false);
    assertClosedCsp(production, false);
    for (const token of devOnlyCspTokens) {
      expect(JSON.stringify(production)).not.toContain(token);
    }
    expect(production["script-src"]).toContain("'self'");
    expect(production["script-src"]).not.toContain("'unsafe-inline'");
    expect(production["script-src"]).not.toContain("'unsafe-eval'");
    expect(production["script-src"]).not.toContain("https:");

    const dev = contentSecurityPolicy(true);
    assertClosedCsp(dev, true);
    expect(dev["script-src"]).toEqual(
      expect.arrayContaining(["'self'", "'unsafe-eval'"]),
    );
    expect(dev["connect-src"]).toEqual(
      expect.arrayContaining(["'self'", "ws:", "http://127.0.0.1:*"]),
    );
    expect(
      securityModuleOptions(false, true).headers.contentSecurityPolicy,
    ).toEqual(production);
    const origin = sentryConnectOrigin("https://public@o0.ingest.sentry.io/1");
    expect(origin).toBe("https://o0.ingest.sentry.io");
    const withSentry = contentSecurityPolicy(false, origin);
    assertClosedCsp(withSentry, false);
    expect(withSentry["connect-src"]).toContain("https://o0.ingest.sentry.io");
    expect(withSentry["connect-src"]).not.toContain("https:");
    const secured = plan(
      { sentry: true },
      { SENTRY_DSN: "https://public@o0.ingest.sentry.io/1" },
    );
    const policy = secured.security?.headers.contentSecurityPolicy;
    expect(policy?.["connect-src"]).toContain("https://o0.ingest.sentry.io");
  });
});

describe("sentry gate", () => {
  it("does not install or init without a DSN", () => {
    const sentry = planSentry(true, readModuleEnv({}));
    const init = () => {
      throw new Error("Sentry.init was called");
    };
    expect(sentry.install).toBe(false);
    expect(sentry.tracing).toBe(false);
    expect(sentry.replay).toBe(false);
    expect(sentry.telemetry).toBe(false);
    expect(initSentry(sentry, init)).toBe(false);
    expect(installedModules(plan({ sentry: true }))).not.toContain(
      "@sentry/nuxt",
    );
  });

  it("installs without tracing, replay, or source-map upload when only the DSN is set", () => {
    const env = { SENTRY_DSN: "https://public@o0.ingest.sentry.io/0" };
    const resolved = plan({ sentry: true }, env);
    expect(resolved.sentry.install).toBe(true);
    expect(resolved.sentry.uploadSourceMaps).toBe(false);
    expect(resolved.sentry.init).toEqual({
      dsn: env.SENTRY_DSN,
      sendDefaultPii: false,
    });
    expect(resolved.sentry.init).not.toHaveProperty("tracesSampleRate");
    expect(resolved.sentry.init).not.toHaveProperty("replaysSessionSampleRate");
    const sentryOptions = resolved.nuxtOptions.sentry as {
      telemetry: boolean;
      sourcemaps: { disable: boolean };
    };
    expect(sentryOptions.telemetry).toBe(false);
    expect(sentryOptions.sourcemaps.disable).toBe(true);
    const seen: unknown[] = [];
    expect(
      initSentry(resolved.sentry, (options) => {
        seen.push(options);
      }),
    ).toBe(true);
    expect(seen).toEqual([resolved.sentry.init]);
  });

  it("drops the module when the flag is false even if a DSN is set", () => {
    const resolved = plan(
      { sentry: false },
      { SENTRY_DSN: "https://public@o0.ingest.sentry.io/0" },
    );
    expect(resolved.sentry.install).toBe(false);
    expect(installedModules(resolved)).not.toContain("@sentry/nuxt");
  });

  it("treats the auth token as build-time upload only", () => {
    const resolved = plan(
      {},
      {
        SENTRY_DSN: "https://public@o0.ingest.sentry.io/0",
        SENTRY_AUTH_TOKEN: "sntrys_example_token_not_a_real_secret",
      },
    );
    expect(resolved.sentry.uploadSourceMaps).toBe(true);
    expect(JSON.stringify(resolved.sentry.init)).not.toContain("sntrys");
  });
});

describe("auth gate", () => {
  const readyEnv = {
    BETTER_AUTH_SECRET: "a".repeat(32),
    DATABASE_URL: "postgres://user:secret@db.internal:5432/app",
    BETTER_AUTH_GITHUB_CLIENT_ID: "github-client",
    BETTER_AUTH_GITHUB_CLIENT_SECRET: "github-secret",
  };

  it("does not register a route or connect when the flag is off", () => {
    const activation = activateAuth(false, readModuleEnv(readyEnv));
    expect(activation).toMatchObject({
      registerRoute: false,
      connect: false,
      oauth: false,
      reason: "disabled",
    });
    expect(JSON.stringify(activation)).not.toContain("secret@");
  });

  it("registers the route but does not connect when the secret or URL is missing", () => {
    expect(activateAuth(true, readModuleEnv({}))).toMatchObject({
      registerRoute: true,
      connect: false,
      reason: "unconfigured",
    });
    expect(
      activateAuth(
        true,
        readModuleEnv({
          BETTER_AUTH_SECRET: "short",
          DATABASE_URL: "postgres://db.internal/app",
        }),
      ).connect,
    ).toBe(false);
    expect(
      activateAuth(
        true,
        readModuleEnv({
          AUTH_SECRET: "b".repeat(32),
          DATABASE_URL: "mysql://db.internal/app",
        }),
      ).connect,
    ).toBe(false);
    expect(isPostgresUrl("postgresql://localhost/app")).toBe(true);
    expect(presentEnv("replace-me")).toBeUndefined();
  });

  it("does not open a database during boot, and opens once on a configured request", async () => {
    const state = createAuthState();
    const opens: string[] = [];
    const deps = {
      open: (url: string) => {
        opens.push(url);
        return { kind: "postgres" as const };
      },
      create: () => ({
        handler: (request: Request) =>
          Promise.resolve(new Response(request.url, { status: 200 })),
      }),
    };
    bootAuth(state);
    expect(opens).toEqual([]);
    expect(state.opened).toBe(false);

    const disabled = await handleAuthRequest(
      new Request("http://localhost/api/auth/session"),
      false,
      readModuleEnv(readyEnv),
      state,
      deps,
    );
    expect(disabled.status).toBe(404);
    expect(opens).toEqual([]);

    const unconfigured = await handleAuthRequest(
      new Request("http://localhost/api/auth/session"),
      true,
      readModuleEnv({}),
      state,
      deps,
    );
    expect(unconfigured.status).toBe(404);
    expect(opens).toEqual([]);

    const ready = await handleAuthRequest(
      new Request("http://localhost/api/auth/session"),
      true,
      readModuleEnv(readyEnv),
      state,
      deps,
    );
    expect(ready.status).toBe(200);
    expect(opens).toEqual([readyEnv.DATABASE_URL]);
    await handleAuthRequest(
      new Request("http://localhost/api/auth/session"),
      true,
      readModuleEnv(readyEnv),
      state,
      deps,
    );
    expect(opens).toHaveLength(1);
    expect(activateAuth(true, readModuleEnv(readyEnv)).oauth).toBe(true);
  });
});

describe("skip list", () => {
  it("matches the installed dependencies and the Rstack console build", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("package.json", root), "utf8"),
    ) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: { build: string; lint: string };
    };
    const names = new Set([
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.devDependencies),
    ]);
    for (const skip of skippedPackages) {
      expect(names.has(skip.packageName)).toBe(false);
    }
    expect(pkg.dependencies["@tanstack/vue-store"]).toBeTruthy();
    expect(pkg.dependencies["@tanstack/vue-form"]).toBeTruthy();
    expect(pkg.dependencies["@tanstack/ai"]).toBeTruthy();
    expect(pkg.dependencies["@tanstack/ai-vue"]).toBeTruthy();
    expect(pkg.scripts.lint).toBe("rs lint");
    expect(pkg.scripts.build).toBe("nuxt build");

    const rstack = readFileSync(new URL("rstack.config.ts", root), "utf8");
    expect(rstack).toContain("./rstack/index.ts");
    expect(rstack).toContain("public/rstack-console");
    expect(rstack).toContain("define.lint");
    const reason = vitePwaSkipReason();
    expect(reason).toContain("public/rstack-console");
    expect(reason).toContain("nuxt build");
    expect(reason).toContain("not incompatible with the Nuxt app builder");
  });
});

describe("legacy docs renderer", () => {
  it("stays on disk when content v3 is off and when the flag is on", () => {
    const disabled = plan({ content: false });
    expect(disabled.content.install).toBe(false);
    expect(installedModules(disabled)).not.toContain("@nuxt/content");
    const enabled = plan({ content: true });
    expect(enabled.content.install).toBe(true);
    expect(installedModules(enabled)).toContain("@nuxt/content");
    expect(
      enabled.installs.find((item) => item.id === "content")?.options,
    ).toEqual({
      experimental: { sqliteConnector: "native" },
    });
    expect(enabled.content.legacyRenderer).toEqual(legacyDocsRenderer);
    for (const path of Object.values(legacyDocsRenderer)) {
      expect(readFileSync(new URL(path, root), "utf8").length).toBeGreaterThan(
        0,
      );
    }
  });
});

describe("env example", () => {
  it("lists secret names with empty values", () => {
    const example = readFileSync(new URL(".env.example", root), "utf8");
    for (const name of [
      "SENTRY_DSN",
      "SENTRY_AUTH_TOKEN",
      "BETTER_AUTH_SECRET",
      "DATABASE_URL",
      "BETTER_AUTH_GITHUB_CLIENT_ID",
      "BETTER_AUTH_GITHUB_CLIENT_SECRET",
    ]) {
      expect(example).toContain(`${name}=`);
      expect(example).not.toMatch(new RegExp(`^${name}=.+`, "m"));
    }
  });
});
