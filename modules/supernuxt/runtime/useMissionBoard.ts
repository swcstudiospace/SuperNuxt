import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { $fetch } from "ofetch";
import { computed, type ComputedRef, type Ref } from "vue";
import { nextStatus } from "../../../src/domain/ledger";
import type { Mission } from "../../../shared/missions";

export interface MissionBoard {
  readonly missions: ComputedRef<readonly Mission[]>;
  readonly pending: ComputedRef<boolean>;
  readonly fetching: ComputedRef<boolean>;
  readonly error: ComputedRef<Error | null>;
  readonly isError: ComputedRef<boolean>;
  readonly refetch: () => Promise<void>;
  readonly prefetch: () => Promise<void>;
  readonly advance: (mission: Mission) => Promise<Mission>;
}

export function useMissionBoard(options?: {
  fault?: Ref<boolean>;
}): MissionBoard {
  const queryClient = useQueryClient();
  const fault = computed(() => options?.fault?.value ?? false);
  const query = useQuery({
    queryKey: computed(() => ["missions", fault.value ? "fault" : "live"]),
    queryFn: async (): Promise<Mission[]> => {
      if (fault.value) throw new Error("Ground link refused the manifest.");
      return await $fetch<Mission[]>("/api/missions");
    },
  });

  async function advance(mission: Mission): Promise<Mission> {
    const updated = await $fetch<Mission>(`/api/missions/${mission.id}`, {
      method: "PATCH",
      body: { status: nextStatus(mission.status) },
    });
    await queryClient.invalidateQueries({ queryKey: ["missions"] });
    return updated;
  }

  return {
    missions: computed(() => query.data.value ?? []),
    pending: computed(() => query.isPending.value),
    fetching: computed(() => query.isFetching.value),
    isError: computed(() => query.isError.value),
    error: computed(() => {
      const value = query.error.value;
      if (!value) return null;
      return value instanceof Error ? value : new Error(String(value));
    }),
    refetch: async () => {
      await query.refetch();
    },
    prefetch: async () => {
      if (import.meta.server) await query.suspense();
    },
    advance,
  };
}
