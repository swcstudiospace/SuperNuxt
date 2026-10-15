<script setup lang="ts">
import { Link, useNavigate, useSearch } from "@tanstack/vue-router";

const pads = [
  { id: "north", name: "North", shift: "dawn" },
  { id: "south", name: "South", shift: "night" },
  { id: "east", name: "East", shift: "dawn" },
] as const;

const search = useSearch({ strict: false });
const navigate = useNavigate();
const visible = computed(() =>
  pads.filter(
    (pad) => pad.shift === (search.value.shift === "night" ? "night" : "dawn"),
  ),
);

function setShift(shift: "dawn" | "night") {
  // This router island is not Nuxt's route tree, so search is untyped here.
  void navigate({
    search: () => ({ shift }),
  } as never);
}
</script>

<template>
  <div class="stack">
    <div class="row">
      <button class="paper-button" type="button" @click="setShift('dawn')">
        Dawn
      </button>
      <button class="paper-button" type="button" @click="setShift('night')">
        Night
      </button>
    </div>
    <p class="meta">
      Search shift: {{ search.shift === "night" ? "night" : "dawn" }}
    </p>
    <p v-if="!visible.length">No pads on this shift.</p>
    <ul v-else>
      <li v-for="pad in visible" :key="pad.id">
        <Link :to="`/pads/${pad.id}`">{{ pad.name }}</Link>
      </li>
    </ul>
  </div>
</template>
