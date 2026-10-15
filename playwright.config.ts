import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test/e2e",
  timeout: 120_000,
  use: {
    baseURL: "http://127.0.0.1:47821",
  },
  webServer: {
    command: "nuxt dev --port 47821 --host 127.0.0.1",
    url: "http://127.0.0.1:47821",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
