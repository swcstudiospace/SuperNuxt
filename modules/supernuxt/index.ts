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

/** User config already on `nuxt.options` wins. Unset keys take the module plan. */
function assignLayerOptions(
  target: Record<string, unknown>,
  additions: Readonly<Record<string, unknown>>,
) {
  for (const [key, value] of Object.entries(additions)) {
    const current = target[key];
    if (current === undefined) {
      target[key] = value;
      continue;
    }
    if (isPlainObject(current) && isPlainObject(value)) {
      const merged: Record<string, unknown> = { ...value, ...current };
      for (const [child, childValue] of Object.entries(value)) {
        const currentChild = merged[child];
        if (
          Array.isArray(childValue) &&
          childValue.length > 0 &&
          Array.isArray(currentChild) &&
          currentChild.length === 0
        ) {
          merged[child] = childValue;
        }
      }
      target[key] = merged;
    }
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
    const layerOptions = nuxt.options as unknown as Record<string, unknown>;
    const plan = resolveModulePlan(parsed, readModuleEnv(process.env), {
      dev: nuxt.options.dev,
      securityEnabled: securityEnabledOverride(layerOptions.security),
    });

    nuxt.options.runtimeConfig.public.supernuxt = parsed;

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
      await installModule(spec.module, spec.options);
    }

    if (plan.auth.registerRoute) {
      addServerHandler({
        route: "/api/auth/**",
        handler: resolver.resolve("./runtime/auth-handler"),
      });
    }
  },
});
