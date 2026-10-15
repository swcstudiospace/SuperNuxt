<script setup lang="ts">
import { useVirtualizer } from "@tanstack/vue-virtual";
import { telemetryLine } from "../../../shared/missions";

const count = 5000;
const parentRef = ref<HTMLElement | null>(null);
const lines = Array.from({ length: count }, (_, index) => telemetryLine(index));

const virtualizer = useVirtualizer(
  computed(() => ({
    count,
    getScrollElement: () => parentRef.value,
    estimateSize: () => 32,
    overscan: 12,
  })),
);
</script>

<template>
  <PageIntro
    kicker="TanStack Virtual"
    title="Telemetry tape"
    lede="Five thousand lines stay off the DOM. Only the rows inside the scroll window are painted."
  />

  <div class="paper">
    <p class="meta">
      {{ count }} lines. Rendered rows:
      {{ virtualizer.getVirtualItems().length }}.
    </p>
    <div ref="parentRef" class="virtual-window">
      <div
        :style="{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }"
      >
        <div
          v-for="item in virtualizer.getVirtualItems()"
          :key="String(item.key)"
          class="virtual-row"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${item.size}px`,
            transform: `translateY(${item.start}px)`,
          }"
        >
          {{ lines[item.index]?.text }}
        </div>
      </div>
    </div>
  </div>
</template>
