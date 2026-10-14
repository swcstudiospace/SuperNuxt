<template>
  <PageIntro
    kicker="TanStack Devtools"
    title="One dock"
    lede="The shell mounts TanStack Devtools with the Vue Query panel registered as a plugin. Open the launcher in the corner of the viewport."
  />

  <div class="paper stack">
    <p>
      Query traffic from the manifest bench shows up in the Vue Query plugin.
      The dock itself is the TanStack Devtools shell.
    </p>
    <p class="meta">
      In production builds the same component stays available so you can confirm
      the wiring. Hide it with <code>supernuxt.queryDevtools: false</code> if a
      deployment should not show it.
    </p>
    <NuxtLink class="paper-button" to="/studio/query"
      >Open the manifest</NuxtLink
    >
  </div>
</template>
