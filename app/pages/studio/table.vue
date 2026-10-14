<script setup lang="ts">
import {
  FlexRender,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from "@tanstack/vue-table";
import type { Mission } from "../../../shared/missions";

const { data, isPending, isError, error, suspense } = useQuery({
  queryKey: ["missions", "live"],
  queryFn: () => $fetch<Mission[]>("/api/missions"),
});

if (import.meta.server) await suspense();

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

const columns = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "vehicle", header: "Vehicle" },
  { accessorKey: "site", header: "Site" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "deltaV", header: "Delta-v" },
];

const rows = computed(() => data.value ?? []);
const table = useTable({
  features,
  columns,
  data: rows,
});
</script>

<template>
  <PageIntro
    kicker="TanStack Table"
    title="Sortable board"
    lede="Headless table state, including sort, comes from TanStack Table v9. The markup is ours."
  />

  <p v-if="isPending">Loading rows…</p>
  <p v-else-if="isError" class="error" role="alert">
    {{ error instanceof Error ? error.message : "The table failed to load." }}
  </p>
  <div v-else class="paper table-wrap">
    <table>
      <caption class="meta" style="caption-side: bottom; padding-top: 0.8rem">
        Click a heading to sort.
        {{
          rows.length
        }}
        missions.
      </caption>
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <th v-for="header in headerGroup.headers" :key="header.id">
            <button
              v-if="!header.isPlaceholder"
              type="button"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender :header="header" />
              {{
                { asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string]
              }}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!table.getRowModel().rows.length">
          <td colspan="6">No missions to show.</td>
        </tr>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getAllCells()" :key="cell.id">
            <FlexRender :cell="cell" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
