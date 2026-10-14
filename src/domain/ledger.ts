import {
  missionStatuses,
  type Mission,
  type MissionStatus,
} from "../../shared/missions";

export interface StatusChange {
  readonly id: string;
  readonly status: MissionStatus;
}

export type ApplyResult =
  | { readonly ok: true; readonly mission: Mission; readonly changed: boolean }
  | { readonly ok: false; readonly reason: "unknown" };

export interface ApplyOutcome {
  readonly board: readonly Mission[];
  readonly result: ApplyResult;
}

export function nextStatus(status: MissionStatus): MissionStatus {
  const index = missionStatuses.indexOf(status);
  return missionStatuses[(index + 1) % missionStatuses.length] ?? status;
}

/**
 * Same id and status returns the same board. A new status returns a new array.
 * The input array is never mutated.
 */
export function applyStatus(
  board: readonly Mission[],
  change: StatusChange,
): ApplyOutcome {
  const index = board.findIndex((mission) => mission.id === change.id);
  const current = board[index];
  if (!current) {
    return { board, result: { ok: false, reason: "unknown" } };
  }
  if (current.status === change.status) {
    return {
      board,
      result: { ok: true, mission: current, changed: false },
    };
  }
  const mission: Mission = { ...current, status: change.status };
  const next = board.slice();
  next[index] = mission;
  return { board: next, result: { ok: true, mission, changed: true } };
}

export function parseStatusChange(
  body: unknown,
):
  | { readonly ok: true; readonly change: StatusChange }
  | { readonly ok: false; readonly message: string } {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      message: "Mission id and a known status are required.",
    };
  }
  const record = body as { id?: unknown; status?: unknown };
  if (typeof record.id !== "string" || record.id.length === 0) {
    return {
      ok: false,
      message: "Mission id and a known status are required.",
    };
  }
  if (
    typeof record.status !== "string" ||
    !missionStatuses.includes(record.status as MissionStatus)
  ) {
    return {
      ok: false,
      message: "Mission id and a known status are required.",
    };
  }
  return {
    ok: true,
    change: { id: record.id, status: record.status as MissionStatus },
  };
}

export interface MissionLedger {
  list(): readonly Mission[];
  apply(change: StatusChange): ApplyResult;
}

export function createLedger(seed: readonly Mission[]): MissionLedger {
  let board: readonly Mission[] = seed.map((mission) => ({ ...mission }));
  return {
    list() {
      return board.map((mission) => ({ ...mission }));
    },
    apply(change) {
      const outcome = applyStatus(board, change);
      if (outcome.result.ok && outcome.result.changed) {
        board = outcome.board;
      }
      return outcome.result;
    },
  };
}

export function isDraftId(id: string): boolean {
  return id.startsWith("local-");
}
