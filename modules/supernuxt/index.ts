import {
  addImports,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import {
  parseSuperNuxtOptions,
  superNuxtDefaults,
  type SuperNuxtOptions,
} from "../../src/domain/options";
import { readModuleEnv } from "../../src/domain/env";
import { resolveModulePlan } from "../../src/domain/modules";

export type { SuperNuxtOptions };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** User values win. Missing nested keys stay on the module plan. */
function mergeLayerValue(planned: unknown, current: unknown): unknown {
  if (current === undefined) return planned;
  if (isPlainObject(planned) && isPlainObject(current)) {
    const merged: Record<string, unknown> = { ...planned };
    for (const [key, currentChild] of Object.entries(current)) {
      merged[key] = mergeLayerValue(planned[key], currentChild);
    }
    return merged;
  }
  if (
    Array.isArray(planned) &&
    Array.isArray(current) &&
    current.length === 0 &&
    planned.length > 0
  ) {
    return planned;
  }
  return current;
}

function assignLayerOptions(
  target: Record<string, unknown>,
  additions: Readonly<Record<string, unknown>>,
) {
  for (const [key, value] of Object.entries(additions)) {
    target[key] = mergeLayerValue(value, target[key]);
  }
}

function securityEnabledOverride(security: unknown): boolean | undefined {
  if (!isPlainObject(security) || !("enabled" in security)) return undefined;
  return typeof security.enabled === "boolean" ? security.enabled : undefined;
}

export default defineNuxtModule<SuperNuxtOptions>({
  meta: {
    name: "supernuxt",
    configKey: "supernuxt",
    compatibility: {
      nuxt: ">=4.0.0",
    },
  },
  defaults: superNuxtDefaults,
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const parsed = parseSuperNuxtOptions(options);
    const env = readModuleEnv(process.env);
    const layerOptions = nuxt.options as unknown as Record<string, unknown>;
    const plan = resolveModulePlan(parsed, env, {
      dev: nuxt.options.dev,
      securityEnabled: securityEnabledOverride(layerOptions.security),
    });

    const publicConfig = nuxt.options.runtimeConfig.public as {
      supernuxt: SuperNuxtOptions;
      sentryDsn: string;
    };
    publicConfig.supernuxt = parsed;
    publicConfig.sentryDsn = plan.sentry.install ? (env.sentryDsn ?? "") : "";

    if (!parsed.devtools) {
      nuxt.options.devtools = { enabled: false };
    }

    nuxt.options.build.transpile.push("@tanstack/vue-query");
    addPlugin(resolver.resolve("./runtime/query"));

    addImports([
      { name: "useQuery", from: "@tanstack/vue-query" },
      { name: "useMutation", from: "@tanstack/vue-query" },
      { name: "useQueryClient", from: "@tanstack/vue-query" },
      { name: "useLiveQuery", from: "@tanstack/vue-db" },
      { name: "useStore", from: "@tanstack/vue-store" },
      { name: "useForm", from: "@tanstack/vue-form" },
      { name: "useTable", from: "@tanstack/vue-table" },
      { name: "useVirtualizer", from: "@tanstack/vue-virtual" },
      { name: "useHotkey", from: "@tanstack/vue-hotkeys" },
      { name: "useHotkeys", from: "@tanstack/vue-hotkeys" },
      { name: "useChat", from: "@tanstack/ai-vue" },
      {
        name: "useServerFn",
        from: resolver.resolve("./runtime/useServerFn"),
      },
      {
        name: "useMissionBoard",
        from: resolver.resolve("./runtime/useMissionBoard"),
      },
      {
        name: "useSuperNuxt",
        from: resolver.resolve("./runtime/useSuperNuxt"),
      },
    ]);

    assignLayerOptions(layerOptions, plan.nuxtOptions);

    for (const spec of plan.installs) {
      await installModule(spec.module);
    }

    if (plan.auth.registerRoute) {
      addServerHandler({
        route: "/api/auth/**",
        handler: resolver.resolve("./runtime/auth-handler"),
      });
    }
  },
});
