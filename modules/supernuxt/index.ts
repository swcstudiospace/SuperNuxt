import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from "@nuxt/kit";
import {
  parseSuperNuxtOptions,
  superNuxtDefaults,
} from "../../src/domain/options";

export interface SuperNuxtOptions {
  queryDevtools: boolean;
  staleTime: number;
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
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const parsed = parseSuperNuxtOptions(options);

    nuxt.options.runtimeConfig.public.supernuxt = parsed;

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
  },
});
