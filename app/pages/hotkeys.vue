<script setup lang="ts">
import { useHotkey, useHotkeyRegistrations } from "@tanstack/vue-hotkeys";

const pads = ["North", "South", "East", "West"];
const index = ref(0);

useHotkey(
  "j",
  () => {
    index.value = Math.min(pads.length - 1, index.value + 1);
  },
  { ignoreInputs: true },
);

useHotkey(
  "k",
  () => {
    index.value = Math.max(0, index.value - 1);
  },
  { ignoreInputs: true },
);

const registrations = useHotkeyRegistrations();
</script>

<template>
  <PageIntro
    kicker="TanStack Hotkeys"
    title="Pad cursor"
    lede="J moves down, K moves up, and Mod+/ opens the shell shortcut card. The registry below is the live HotkeyManager view."
  />

  <div class="paper stack">
    <p aria-live="polite">
      Selected pad: <strong>{{ pads[index] }}</strong>
    </p>
    <ol>
      <li
        v-for="(pad, padIndex) in pads"
        :key="pad"
        :style="{ fontWeight: padIndex === index ? '700' : '400' }"
      >
        {{ pad }}
      </li>
    </ol>
    <h2>Registered</h2>
    <ul>
      <li v-for="item in registrations.hotkeys" :key="item.id">
        <code>{{ item.hotkey }}</code> · fired {{ item.triggerCount }}
      </li>
    </ul>
    <p v-if="!registrations.hotkeys.length" class="meta">
      No hotkeys are registered.
    </p>
  </div>
</template>
