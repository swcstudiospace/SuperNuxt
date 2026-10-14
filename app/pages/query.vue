<script setup lang="ts">
import type { Mission, MissionStatus } from "../../shared/missions";
import { missionStatuses } from "../../shared/missions";

const fault = ref(false);
const queryClient = useQueryClient();

const { data, error, isPending, isFetching, isError, refetch, suspense } =
  useQuery({
    queryKey: computed(() => ["missions", fault.value ? "fault" : "live"]),
    queryFn: async (): Promise<Mission[]> => {
      if (fault.value) {
        throw new Error("Ground link refused the manifest.");
      }
      return await $fetch<Mission[]>("/api/missions");
    },
  });

if (import.meta.server) {
  await suspense();
}

const { mutate, isPending: updating } = useMutation({
  mutationFn: (body: { id: string; status: MissionStatus }) =>
    $fetch<Mission>(`/api/missions/${body.id}`, { method: "PATCH", body }),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["missions"] });
  },
});

function nextStatus(status: MissionStatus): MissionStatus {
  const index = missionStatuses.indexOf(status);
  return missionStatuses[(index + 1) % missionStatuses.length] ?? status;
}
</script>

<template>
  <PageIntro
    kicker="TanStack Query"
    title="Manifest"
    lede="The board is fetched with Vue Query, dehydrated during SSR, and patched through a mutation. The fault switch shows the error state without leaving the page."
  />

  <div class="row" style="margin-bottom: 1rem">
    <button
      class="ghost"
      type="button"
      :disabled="isFetching"
      @click="refetch()"
    >
      {{ isFetching ? "Refreshing" : "Refetch" }}
    </button>
    <button class="ghost" type="button" @click="fault = !fault">
      {{ fault ? "Restore link" : "Simulate fault" }}
    </button>
  </div>

  <p v-if="isPending" class="meta">Pulling the manifest…</p>
  <p v-else-if="isError" class="error" role="alert">
    {{ error instanceof Error ? error.message : "The manifest failed." }}
  </p>
  <div v-else class="paper">
    <ul class="stack" style="list-style: none; padding: 0; margin: 0">
      <li
        v-for="mission in data"
        :key="mission.id"
        class="row"
        style="justify-content: space-between"
      >
        <div>
          <strong>{{ mission.code }}</strong>
          <span class="meta"> {{ mission.name }} · {{ mission.site }}</span>
          <div>
            <span class="status" :class="mission.status">{{
              mission.status
            }}</span>
          </div>
        </div>
        <button
          class="paper-button"
          type="button"
          :disabled="updating"
          @click="
            mutate({ id: mission.id, status: nextStatus(mission.status) })
          "
        >
          Advance
        </button>
      </li>
    </ul>
    <p v-if="!data?.length" class="meta">The manifest is empty.</p>
  </div>
</template>
