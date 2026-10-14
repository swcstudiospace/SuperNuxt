<script setup lang="ts">
const fault = ref(false);
const board = useMissionBoard({ fault });
const updating = ref(false);

if (import.meta.server) {
  await board.prefetch();
}

async function advance(mission: (typeof board.missions.value)[number]) {
  updating.value = true;
  try {
    await board.advance(mission);
  } finally {
    updating.value = false;
  }
}
</script>

<template>
  <PageIntro
    kicker="TanStack Query"
    title="Manifest"
    lede="The board is one server ledger. Query and the table share it. Sending the status a row already has leaves the ledger where it is. The fault switch shows the error state without leaving the page."
  />

  <div class="row" style="margin-bottom: 1rem">
    <button
      class="ghost"
      type="button"
      :disabled="board.fetching.value"
      @click="board.refetch()"
    >
      {{ board.fetching.value ? "Refreshing" : "Refetch" }}
    </button>
    <button class="ghost" type="button" @click="fault = !fault">
      {{ fault ? "Restore link" : "Simulate fault" }}
    </button>
  </div>

  <p v-if="board.pending.value" class="meta">Pulling the manifest…</p>
  <p v-else-if="board.isError.value" class="error" role="alert">
    {{ board.error.value?.message ?? "The manifest failed." }}
  </p>
  <div v-else class="paper">
    <ul class="stack" style="list-style: none; padding: 0; margin: 0">
      <li
        v-for="mission in board.missions.value"
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
          @click="advance(mission)"
        >
          Advance
        </button>
      </li>
    </ul>
    <p v-if="!board.missions.value.length" class="meta">
      The manifest is empty.
    </p>
  </div>
</template>
