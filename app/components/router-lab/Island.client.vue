<script setup lang="ts">
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/vue-router";
import PadDetail from "./PadDetail.vue";
import PadList from "./PadList.vue";
import RootView from "./RootView.vue";

const rootRoute = createRootRoute({
  component: RootView,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>) => ({
    shift: search.shift === "night" ? "night" : "dawn",
  }),
  component: PadList,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pads/$padId",
  component: PadDetail,
});

const routeTree = rootRoute.addChildren([indexRoute, detailRoute]);

const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: ["/"] }),
});
</script>

<template>
  <RouterProvider :router="router" />
</template>
