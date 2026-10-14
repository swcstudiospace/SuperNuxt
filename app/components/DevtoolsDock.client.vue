<script setup lang="ts">
import { computed, defineComponent, h } from "vue";
import { TanStackDevtools } from "@tanstack/vue-devtools";
import { VueQueryDevtoolsPanel } from "@tanstack/vue-query-devtools";

type DockTheme = "light" | "dark" | "system" | { theme?: string };

function themeName(value: DockTheme | undefined): "light" | "dark" | "system" {
  const raw = typeof value === "string" ? value : value?.theme;
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "dark";
}

const QueryPanel = defineComponent({
  name: "QueryPanel",
  props: {
    theme: {
      type: [String, Object] as unknown as () => DockTheme,
      default: "dark",
    },
  },
  setup(props) {
    const theme = computed(() => themeName(props.theme));
    return () => h(VueQueryDevtoolsPanel, { theme: theme.value });
  },
});

const plugins = [{ name: "Vue Query", component: QueryPanel }];
</script>

<template>
  <TanStackDevtools :plugins="plugins" />
</template>
