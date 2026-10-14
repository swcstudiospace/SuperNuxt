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
    return await requestFetch<ServerOutput<N>>(
      `/api/__supernuxt/fn/${fnName}`,
      {
        method: "POST",
        body: input,
      },
    );
  }

  return { name: fnName as N, call };
}
