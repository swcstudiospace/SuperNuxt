<script setup lang="ts">
import { barX, defineChart } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { Chart } from "@tanstack/charts/vue";
import { missions } from "#layers/supernuxt/shared/missions";

const focused = ref("");

function onFocusChange(point: { y: unknown } | null | undefined): void {
  focused.value = point ? String(point.y) : "";
}

const definition = computed(() =>
  defineChart({
    chart: () => ({
      marks: [
        barX(missions, {
          x: "deltaV",
          y: "code",
          fill: "#1f6b52",
        }),
      ],
      scales: {
        x: { scale: scaleLinear, nice: true },
        y: { scale: () => scaleBand<string>().padding(0.18) },
      },
    }),
  }),
);
</script>

<template>
  <PageIntro
    kicker="TanStack Charts"
    title="Delta-v"
    lede="A bar chart from the chart grammar. The Vue adapter renders the SVG; the definition stays framework-neutral."
  />

  <div class="paper">
    <Chart
      class="chart-host"
      :definition="definition"
      aria-label="Delta-v by mission code"
      :aspect-ratio="16 / 9"
      :initial-width="720"
      :on-focus-change="onFocusChange"
    />
    <p class="meta">
      {{
        focused
          ? `Focused code ${focused}`
          : "Focus a bar with the pointer or keyboard."
      }}
    </p>
  </div>
</template>
