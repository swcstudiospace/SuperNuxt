<script setup lang="ts">
import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/vue-store";
import { missions } from "../../shared/missions";

const deck = new Store({
  callsign: "Harbor",
  density: "comfortable" as "comfortable" | "compact",
  pinned: [] as string[],
});

const callsign = useStore(deck, (state) => state.callsign);
const density = useStore(deck, (state) => state.density);
const pinned = useStore(deck, (state) => state.pinned);

function setCallsign(value: string) {
  deck.setState((state) => ({ ...state, callsign: value }));
}

function toggleDensity() {
  deck.setState((state) => ({
    ...state,
    density: state.density === "comfortable" ? "compact" : "comfortable",
  }));
}

function togglePin(id: string) {
  deck.setState((state) => ({
    ...state,
    pinned: state.pinned.includes(id)
      ? state.pinned.filter((item) => item !== id)
      : [...state.pinned, id],
  }));
}
</script>

<template>
  <PageIntro
    kicker="TanStack Store"
    title="Deck preferences"
    lede="Callsign, density, and pins live in a TanStack Store. Selectors subscribe the template to one slice at a time."
  />

  <div class="paper stack" :class="density">
    <label>
      Callsign
      <input
        :value="callsign"
        type="text"
        maxlength="24"
        @input="setCallsign(($event.target as HTMLInputElement).value)"
      />
    </label>
    <p>
      Signed in as <strong>{{ callsign || "unassigned" }}</strong
      >. Density is {{ density }}.
    </p>
    <button class="paper-button" type="button" @click="toggleDensity">
      Toggle density
    </button>
    <ul style="list-style: none; padding: 0; margin: 0" class="stack">
      <li
        v-for="mission in missions"
        :key="mission.id"
        class="row"
        style="justify-content: space-between"
      >
        <span>{{ mission.code }} {{ mission.name }}</span>
        <button
          class="paper-button"
          type="button"
          @click="togglePin(mission.id)"
        >
          {{ pinned.includes(mission.id) ? "Unpin" : "Pin" }}
        </button>
      </li>
    </ul>
    <p class="meta">
      {{ pinned.length ? `${pinned.length} pinned` : "Nothing pinned yet." }}
    </p>
  </div>
</template>
