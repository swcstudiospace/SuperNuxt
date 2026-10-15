import { activateAuth, type AuthActivation } from "./auth";
import type { ModuleEnv } from "./env";
import type { SuperNuxtOptions } from "./options";
import { planSentry, type SentryPlan } from "./sentry";
import {
  securityModuleOptions,
  sentryConnectOrigin,
  type SecurityModuleOptions,
} from "./security";

export const modulePackageNames = {
  image: "@nuxt/image",
  fonts: "@nuxt/fonts",
  seo: "@nuxtjs/seo",
  scripts: "@nuxt/scripts",
  i18n: "@nuxtjs/i18n",
  hints: "@nuxt/hints",
  security: "nuxt-security",
  sentry: "@sentry/nuxt",
  content: "@nuxt/content",
} as const;

/** Remote font providers. All of them are forced off so the module does not fetch fonts. */
export const disabledFontProviders = {
  adobe: false,
  bunny: false,
  fontshare: false,
  fontsource: false,
  google: false,
  googleicons: false,
  npm: false,
} as const;

export const legacyDocsRenderer = {
  parser: "src/domain/docs.ts",
  catalog: "shared/docs.ts",
  page: "app/pages/docs/[slug].vue",
  corpus: "content/docs/architecture.md",
} as const;

export const siteDefaults = {
  name: "SuperNuxt",
  description: "Nuxt 4 framework with TanStack and a Rstack side console.",
} as const;

export interface InstallSpec {
  readonly id: keyof typeof modulePackageNames;
  readonly module: string;
  readonly options: Record<string, unknown>;
}

export interface ModulePlanInput {
  readonly dev: boolean;
  /**
   * `security.enabled` from nuxt.config, when the user set it.
   * `false` is passed through to nuxt-security. `undefined` follows the SuperNuxt flag.
   */
  readonly securityEnabled?: boolean;
}

export interface ModulePlan {
  readonly installs: readonly InstallSpec[];
  readonly devtools: boolean;
  readonly nuxtOptions: Readonly<Record<string, unknown>>;
  readonly auth: AuthActivation;
  readonly sentry: SentryPlan;
  readonly security: SecurityModuleOptions | null;
  readonly content: {
    readonly install: boolean;
    readonly legacyRenderer: typeof legacyDocsRenderer;
  };
  readonly scriptsRegistry: Readonly<Record<string, never>>;
  readonly fontProviders: typeof disabledFontProviders;
}

function install(
  id: keyof typeof modulePackageNames,
  options: Record<string, unknown>,
): InstallSpec {
  return { id, module: modulePackageNames[id], options };
}

/**
 * Decides which modules are registered. A `false` flag omits that module,
 * so its hooks, routes, and build plugins are not added.
 */
export function resolveModulePlan(
  options: SuperNuxtOptions,
  env: ModuleEnv,
  input: ModulePlanInput,
): ModulePlan {
  const installs: InstallSpec[] = [];
  const nuxtOptions: Record<string, unknown> = {};
  const scriptsRegistry: Record<string, never> = {};

  if (options.image) {
    const image = { provider: "ipx" };
    nuxtOptions.image = image;
    installs.push(install("image", image));
  }

  if (options.fonts) {
    const fonts = {
      providers: disabledFontProviders,
      processCSSVariables: false,
    };
    nuxtOptions.fonts = fonts;
    installs.push(install("fonts", fonts));
  }

  if (options.i18n) {
    const i18n = {
      defaultLocale: "en",
      locales: [{ code: "en", language: "en", name: "English" }],
      strategy: "no_prefix",
      detectBrowserLanguage: false,
      bundle: { optimizeTranslationDirective: false },
    };
    nuxtOptions.i18n = i18n;
    installs.push(install("i18n", i18n));
  }

  if (options.seo) {
    nuxtOptions.site = siteDefaults;
    nuxtOptions.sitemap = { enabled: options.sitemap };
    nuxtOptions.robots = { enabled: options.robots };
    nuxtOptions.ogImage = { enabled: options.ogImage, zeroRuntime: true };
    nuxtOptions.linkChecker = { enabled: false };
    nuxtOptions.skewProtection = false;
    const nuxtseo = { enabled: true, tips: false };
    nuxtOptions.nuxtseo = nuxtseo;
    installs.push(install("seo", nuxtseo));
  }

  if (options.scripts) {
    const scripts = { enabled: true, registry: scriptsRegistry };
    nuxtOptions.scripts = scripts;
    installs.push(install("scripts", scripts));
  }

  if (options.hints) {
    const hints = {
      devtools: options.devtools,
      features: {
        hydration: true,
        lazyLoad: true,
        webVitals: true,
        thirdPartyScripts: false,
        htmlValidate: true,
      },
    };
    nuxtOptions.hints = hints;
    installs.push(install("hints", hints));
  }

  let security: SecurityModuleOptions | null = null;
  if (options.security) {
    const enabled = input.securityEnabled !== false;
    const connectOrigin = options.sentry
      ? sentryConnectOrigin(env.sentryDsn)
      : undefined;
    security = securityModuleOptions(input.dev, enabled, connectOrigin);
    nuxtOptions.security = security;
    installs.push(install("security", { ...security }));
  }

  const sentry = planSentry(options.sentry, env);
  if (sentry.install) {
    const sentryOptions = {
      enabled: true,
      telemetry: false,
      sourcemaps: { disable: !sentry.uploadSourceMaps },
    };
    nuxtOptions.sentry = sentryOptions;
    installs.push(install("sentry", sentryOptions));
  }

  if (options.content) {
    const content = {
      experimental: { sqliteConnector: "native" as const },
    };
    nuxtOptions.content = content;
    installs.push(install("content", content));
  }

  return {
    installs,
    devtools: options.devtools,
    nuxtOptions,
    auth: activateAuth(options.auth, env),
    sentry,
    security,
    content: {
      install: options.content,
      legacyRenderer: legacyDocsRenderer,
    },
    scriptsRegistry,
    fontProviders: disabledFontProviders,
  };
}

export function installedModules(plan: ModulePlan): string[] {
  return plan.installs.map((item) => item.module);
}
