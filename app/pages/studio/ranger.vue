<script setup lang="ts">
import { Ranger } from "@tanstack/ranger";
import { missions } from "#shared/missions";

const track = ref<HTMLDivElement | null>(null);
const values = ref<number[]>([2000, 9000]);
const min = 0;
const max = 12000;

const box: { ranger?: Ranger<HTMLDivElement> } = {};
box.ranger = new Ranger<HTMLDivElement>({
  getRangerElement: () => track.value,
  values: values.value,
  min,
  max,
  stepSize: 100,
  rerender: () => {
    if (!box.ranger) return;
    values.value = [...box.ranger.sortedValues];
  },
  onChange: (instance) => {
    values.value = [...instance.sortedValues];
  },
});
const ranger = box.ranger;

const low = computed(() => values.value[0] ?? min);
const high = computed(() => values.value[1] ?? max);
const visible = computed(() =>
  missions.filter(
    (mission) => mission.deltaV >= low.value && mission.deltaV <= high.value,
  ),
);

onMounted(() => {
  ranger.setOptions({
    ...ranger.options,
    getRangerElement: () => track.value,
    values: values.value,
    rerender: () => {
      values.value = [...ranger.sortedValues];
    },
  });
});
</script>

<template>
  <PageIntro
    kicker="TanStack Ranger"
    title="Delta-v window"
    lede="Ranger is headless. SuperNuxt draws the track and handles, and the sorted values filter the mission list."
  />

  <div class="paper">
    <div
      ref="track"
      class="track"
      @mousedown="(event) => ranger.handleDrag(event)"
      @touchstart="(event) => ranger.handleDrag(event)"
    >
      <div
        class="track-fill"
        :style="{
          left: `${ranger.getPercentageForValue(low)}%`,
          width: `${ranger.getPercentageForValue(high) - ranger.getPercentageForValue(low)}%`,
        }"
      />
      <button
        v-for="(handle, index) in ranger.handles()"
        :key="index"
        class="handle"
        type="button"
        :aria-label="index === 0 ? 'Window start' : 'Window end'"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="handle.value"
        :style="{ left: `${ranger.getPercentageForValue(handle.value)}%` }"
        @keydown="handle.onKeyDownHandler"
        @mousedown.stop="handle.onMouseDownHandler"
        @touchstart.stop="handle.onTouchStart"
      />
    </div>
    <p>
      {{ low }} to {{ high }} m/s. {{ visible.length }} missions sit in the
      window.
    </p>
    <p v-if="!visible.length" class="meta">
      Widen the window to bring a mission back.
    </p>
    <ul v-else>
      <li v-for="mission in visible" :key="mission.id">
        {{ mission.code }} · {{ mission.deltaV }} m/s
      </li>
    </ul>
  </div>
</template>
