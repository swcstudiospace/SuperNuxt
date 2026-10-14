import { useRuntimeConfig } from "#imports";
import {
  superNuxtDefaults,
  type SuperNuxtOptions,
} from "../../../src/domain/options";

export function useSuperNuxt(): SuperNuxtOptions {
  const config = useRuntimeConfig();
  return config.public.supernuxt ?? superNuxtDefaults;
}
