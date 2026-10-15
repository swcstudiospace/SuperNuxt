import * as Sentry from "@sentry/nuxt";
import { useRuntimeConfig } from "#imports";
import { initSentry, planSentry } from "./src/domain/sentry";

const dsn = (useRuntimeConfig().public as { sentryDsn?: string }).sentryDsn;
const plan = planSentry(true, {
  sentryDsn: typeof dsn === "string" && dsn.length > 0 ? dsn : undefined,
});

initSentry(plan, (options) => {
  Sentry.init(options);
});
