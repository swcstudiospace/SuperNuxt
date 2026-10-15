export interface SuperNuxtOptions {
  readonly queryDevtools: boolean;
  readonly staleTime: number;
  /** @nuxt/image. Local ipx provider only. */
  readonly image: boolean;
  /** @nuxt/fonts. Remote font providers stay off. */
  readonly fonts: boolean;
  /** @nuxtjs/seo master switch. */
  readonly seo: boolean;
  readonly sitemap: boolean;
  readonly robots: boolean;
  readonly ogImage: boolean;
  /** @nuxt/scripts. The registry ships empty. */
  readonly scripts: boolean;
  /** @nuxtjs/i18n. `no_prefix`, English only, until a consumer adds locales. */
  readonly i18n: boolean;
  /** @nuxt/hints. The module itself no-ops outside `nuxt dev`. */
  readonly hints: boolean;
  /** Nuxt DevTools. Also forced off when `devtools.enabled` is false. */
  readonly devtools: boolean;
  /**
   * nuxt-security. Default on, with an explicit CSP.
   * `false` omits the module. `security.enabled: false` is also honored.
   */
  readonly security: boolean;
  /**
   * @sentry/nuxt. The package stays out of the build unless `SENTRY_DSN` is set.
   * `false` omits it even when a DSN is present.
   */
  readonly sentry: boolean;
  /**
   * better-auth + drizzle. Default off.
   * `true` registers `/api/auth/**`, which still refuses to open a database
   * until `BETTER_AUTH_SECRET` and a postgres `DATABASE_URL` are set.
   */
  readonly auth: boolean;
  /**
   * @nuxt/content v3. Default off so `content/docs` keeps the legacy renderer
   * in `src/domain/docs.ts` until this is turned on.
   */
  readonly content: boolean;
}

export const superNuxtDefaults: SuperNuxtOptions = {
  queryDevtools: true,
  staleTime: 30_000,
  image: true,
  fonts: true,
  seo: true,
  sitemap: true,
  robots: true,
  ogImage: true,
  scripts: true,
  i18n: true,
  hints: true,
  devtools: true,
  security: true,
  sentry: true,
  auth: false,
  content: false,
};

const flagNames = [
  "queryDevtools",
  "image",
  "fonts",
  "seo",
  "sitemap",
  "robots",
  "ogImage",
  "scripts",
  "i18n",
  "hints",
  "devtools",
  "security",
  "sentry",
  "auth",
  "content",
] as const satisfies readonly (keyof SuperNuxtOptions)[];

function booleanFlag(name: string, value: unknown, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") {
    throw new Error(`supernuxt.${name} must be a boolean.`);
  }
  return value;
}

export function parseSuperNuxtOptions(
  input: Partial<SuperNuxtOptions> | undefined,
): SuperNuxtOptions {
  const staleTime = input?.staleTime ?? superNuxtDefaults.staleTime;
  if (typeof staleTime !== "number" || staleTime < 0) {
    throw new Error(
      "supernuxt options need a boolean queryDevtools and a nonnegative staleTime.",
    );
  }
  const flags = {} as Record<(typeof flagNames)[number], boolean>;
  for (const name of flagNames) {
    flags[name] = booleanFlag(name, input?.[name], superNuxtDefaults[name]);
  }
  return { ...flags, staleTime };
}
