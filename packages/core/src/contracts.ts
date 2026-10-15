import { z } from "zod";
import type { Mission } from "./missions.ts";

export interface Briefing {
  readonly missionId: string;
  readonly headline: string;
  readonly note: string;
}

export interface ServerContracts {
  readonly briefing: {
    readonly input: { readonly missionId: string };
    readonly output: Briefing;
  };
}

export type ServerFnName = keyof ServerContracts & string;

export type ServerInput<N extends ServerFnName> = ServerContracts[N]["input"];

export type ServerOutput<N extends ServerFnName> = ServerContracts[N]["output"];

const briefingInput = z.object({
  missionId: z.string().min(1),
});

export type ServerFnResult<N extends ServerFnName> =
  | { readonly ok: true; readonly value: ServerOutput<N> }
  | {
      readonly ok: false;
      readonly status: 400 | 404;
      readonly message: string;
    };

/**
 * Validates the name and body, then reads the snapshot. It cannot write the ledger.
 */
export function dispatchServerFn(
  name: string,
  body: unknown,
  board: readonly Mission[],
): ServerFnResult<ServerFnName> {
  if (!/^[a-z][a-z0-9-]*$/.test(name) || name !== "briefing") {
    return { ok: false, status: 404, message: "Unknown server function" };
  }
  const parsed = briefingInput.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, message: "Mission id is required." };
  }
  const mission = board.find((item) => item.id === parsed.data.missionId);
  if (!mission) {
    return { ok: false, status: 404, message: "Unknown mission" };
  }
  return {
    ok: true,
    value: {
      missionId: mission.id,
      headline: `${mission.code} is ${mission.status}`,
      note: `${mission.name} flies on ${mission.vehicle} from ${mission.site}. Window ${mission.window}. Crew ${mission.crew}.`,
    },
  };
}
