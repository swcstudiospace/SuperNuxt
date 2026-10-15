import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query";
import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
} from "@tanstack/vue-query";
import { defineNuxtPlugin, useRuntimeConfig, useState } from "#imports";

export default defineNuxtPlugin((nuxt) => {
  const config = useRuntimeConfig();
  const vueQueryState = useState<DehydratedState | null>(
    "vue-query",
    () => null,
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: config.public.supernuxt.staleTime,
        retry: 1,
      },
    },
  });

  const options: VueQueryPluginOptions = { queryClient };
  nuxt.vueApp.use(VueQueryPlugin, options);

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client && vueQueryState.value) {
    hydrate(queryClient, vueQueryState.value);
  }
});
