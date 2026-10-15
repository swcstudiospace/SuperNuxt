import { useRequestFetch } from "#imports";
import {
  assertServerFnName,
  type ServerFnName,
  type ServerInput,
  type ServerOutput,
} from "@swcstudio/supernuxt-core";

type PostFetch = (
  url: string,
  options: { method: "POST"; body: unknown },
) => Promise<unknown>;

export function useServerFn<N extends ServerFnName>(name: N) {
  const fnName = assertServerFnName(name);
  const requestFetch = useRequestFetch() as unknown as PostFetch;

  async function call(input: ServerInput<N>): Promise<ServerOutput<N>> {
    const result = await requestFetch(`/api/__supernuxt/fn/${fnName}`, {
      method: "POST",
      body: input,
    });
    return result as ServerOutput<N>;
  }

  return { name: fnName as N, call };
}
