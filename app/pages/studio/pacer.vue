<script setup lang="ts">
import { useDebouncedValue, useRateLimiter } from "@tanstack/vue-pacer";
import { missions } from "../../../shared/missions";

const draft = ref("");
const [debounced] = useDebouncedValue(draft, { wait: 350 });
const accepted = ref(0);
const limiter = useRateLimiter(
  () => {
    accepted.value += 1;
  },
  { limit: 3, window: 2000 },
  (state) => ({
    rejectionCount: state.rejectionCount,
    isExceeded: state.isExceeded,
  }),
);
const limiterState = limiter.state;

const matches = computed(() => {
  const query = debounced.value.trim().toLowerCase();
  if (!query) return missions;
  return missions.filter((mission) =>
    `${mission.code} ${mission.name} ${mission.site}`
      .toLowerCase()
      .includes(query),
  );
});
</script>

<template>
  <PageIntro
    kicker="TanStack Pacer"
    title="Comms"
    lede="Search waits 350ms before it filters. The ping button is rate limited to three calls each two seconds."
  />

  <div class="paper stack">
    <label>
      Search missions
      <input v-model="draft" type="search" placeholder="Try Mahia" />
    </label>
    <p class="meta">
      Typed “{{ draft || "…" }}”. Debounced “{{ debounced || "…" }}”.
    </p>
    <p v-if="!matches.length" class="meta">No mission matches that call.</p>
    <ul v-else>
      <li v-for="mission in matches" :key="mission.id">
        {{ mission.code }} · {{ mission.name }} · {{ mission.site }}
      </li>
    </ul>
    <div class="row">
      <button
        class="paper-button primary"
        type="button"
        @click="limiter.maybeExecute()"
      >
        Ping ground
      </button>
      <span
        >Accepted {{ accepted }}. Rejected
        {{ limiterState.rejectionCount }}.</span
      >
    </div>
    <p v-if="limiterState.isExceeded" class="error" role="status">
      Rate limit is holding the next ping.
    </p>
  </div>
</template>
