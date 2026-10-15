import { useRequestFetch } from "#imports";
import {
  type ServerFnName,
  type ServerInput,
  type ServerOutput,
} from "../../../src/domain/contracts";
import { assertServerFnName } from "../../../src/index";

export function useServerFn<N extends ServerFnName>(name: N) {
  const fnName = assertServerFnName(name);
  const requestFetch = useRequestFetch();

  async function call(input: ServerInput<N>): Promise<ServerOutput<N>> {
    // The dynamic route is not part of Nuxt's typed fetch map, which only
    // offers GET for an unknown path. The call itself stays a POST.
    const post = requestFetch as (
      url: string,
      options: { method: "POST"; body: ServerInput<N> },
    ) => Promise<ServerOutput<N>>;
    return await post(`/api/__supernuxt/fn/${fnName}`, {
      method: "POST",
      body: input,
    });
  }

  return { name: fnName as N, call };
}
