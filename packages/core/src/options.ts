export interface SuperNuxtOptions {
  readonly queryDevtools: boolean;
  readonly staleTime: number;
}

export const superNuxtDefaults: SuperNuxtOptions = {
  queryDevtools: true,
  staleTime: 30_000,
};

export function parseSuperNuxtOptions(
  input: Partial<SuperNuxtOptions> | undefined,
): SuperNuxtOptions {
  const staleTime = input?.staleTime ?? superNuxtDefaults.staleTime;
  const queryDevtools = input?.queryDevtools ?? superNuxtDefaults.queryDevtools;
  if (
    typeof queryDevtools !== "boolean" ||
    typeof staleTime !== "number" ||
    staleTime < 0
  ) {
    throw new Error(
      "supernuxt options need a boolean queryDevtools and a nonnegative staleTime.",
    );
  }
  return { queryDevtools, staleTime };
}
