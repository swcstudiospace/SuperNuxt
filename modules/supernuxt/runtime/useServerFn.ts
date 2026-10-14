import { useRequestFetch } from "#imports";
import { assertServerFnName } from "../../../src/index";

export function useServerFn<TOutput, TInput = Record<string, never>>(
  name: string,
) {
  const fnName = assertServerFnName(name);
  const requestFetch = useRequestFetch();

  async function call(input?: TInput): Promise<TOutput> {
    return await requestFetch<TOutput>(`/api/__supernuxt/fn/${fnName}`, {
      method: "POST",
      body: input ?? {},
    });
  }

  return { name: fnName, call };
}
