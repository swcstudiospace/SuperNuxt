import { useRuntimeConfig } from "#imports";
import { superNuxtDefaults, type SuperNuxtOptions } from "@supernuxt/core";

export function useSuperNuxt(): SuperNuxtOptions {
  const config = useRuntimeConfig();
  return config.public.supernuxt ?? superNuxtDefaults;
}
