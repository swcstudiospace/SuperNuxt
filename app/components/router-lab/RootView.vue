<script setup lang="ts">
import { Outlet, Link } from "@tanstack/vue-router";
</script>

<template>
  <div class="stack">
    <div class="row">
      <Link to="/">Pads</Link>
      <Link to="/pads/north">North</Link>
      <Link to="/pads/south">South</Link>
    </div>
    <Outlet />
  </div>
</template>
