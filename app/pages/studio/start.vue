<script setup lang="ts">
import { missions } from "../../../shared/missions";

const briefingFn = useServerFn("briefing");
const missionId = ref(missions[0]?.id ?? "");
const result = ref<Awaited<ReturnType<typeof briefingFn.call>> | null>(null);
const error = ref("");
const pending = ref(false);

async function run() {
  pending.value = true;
  error.value = "";
  try {
    result.value = await briefingFn.call({ missionId: missionId.value });
  } catch (caught) {
    result.value = null;
    error.value =
      caught instanceof Error ? caught.message : "The server function failed.";
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <PageIntro
    kicker="Nitro"
    title="Server functions"
    lede="A named function on the client, a Zod-checked Nitro handler on the server. SuperNuxt does not mount a separate React or Solid server framework."
  />

  <div class="paper stack">
    <label>
      Mission
      <select v-model="missionId">
        <option
          v-for="mission in missions"
          :key="mission.id"
          :value="mission.id"
        >
          {{ mission.code }} {{ mission.name }}
        </option>
      </select>
    </label>
    <button
      class="paper-button primary"
      type="button"
      :disabled="pending"
      @click="run"
    >
      {{ pending ? "Calling" : "Call briefing" }}
    </button>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <article v-else-if="result">
      <h2>{{ result.headline }}</h2>
      <p>{{ result.note }}</p>
    </article>
    <p v-else class="meta">No briefing yet.</p>
  </div>
</template>
