<script setup lang="ts">
import { createCollection, eq, localOnlyCollectionOptions } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/vue-db";
import {
  missions,
  missionStatuses,
  type Mission,
  type MissionStatus,
} from "../../shared/missions";

const status = ref<"all" | MissionStatus>("all");

const board = createCollection(
  localOnlyCollectionOptions({
    id: "mission-board",
    getKey: (item: Mission) => item.id,
    initialData: missions.map((mission) => ({ ...mission })),
  }),
);

const { data, isLoading } = useLiveQuery(
  (query) => {
    const rows = query.from({ missions: board });
    if (status.value === "all") return rows;
    return rows.where(({ missions: row }) => eq(row.status, status.value));
  },
  [status],
);

const draft = ref("Spare pallet");

function addRow() {
  const name = draft.value.trim();
  if (!name) return;
  const id = `local-${Date.now()}`;
  board.insert({
    id,
    code: "LOCAL",
    name,
    vehicle: "Skiff",
    status: "standby",
    window: "unscheduled",
    crew: 0,
    deltaV: 400,
    site: "Desk",
  });
  draft.value = "";
}
</script>

<template>
  <PageIntro
    kicker="TanStack DB"
    title="Live board"
    lede="A local-only collection feeds a live query. Filters and inserts stay on the client and update the list without another round trip."
  />

  <div class="paper stack">
    <div class="row">
      <label>
        Status
        <select v-model="status">
          <option value="all">All</option>
          <option v-for="item in missionStatuses" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </label>
      <label>
        New row
        <input v-model="draft" type="text" maxlength="40" />
      </label>
      <button class="paper-button primary" type="button" @click="addRow">
        Insert
      </button>
    </div>

    <p v-if="isLoading" class="meta">Syncing the collection…</p>
    <p v-else-if="!data.length" class="meta">No rows match this filter.</p>
    <ul v-else style="margin: 0; padding-left: 1.1rem">
      <li v-for="row in data" :key="row.id">
        <strong>{{ row.code }}</strong> {{ row.name }}
        <span class="status" :class="row.status">{{ row.status }}</span>
        <button
          class="paper-button"
          type="button"
          @click="board.delete(row.id)"
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>
