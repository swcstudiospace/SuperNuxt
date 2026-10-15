import * as Sentry from "@sentry/nuxt";
import { readModuleEnv } from "./src/domain/env";
import { initSentry, planSentry } from "./src/domain/sentry";

const plan = planSentry(true, readModuleEnv(process.env));

initSentry(plan, (options) => {
  Sentry.init(options);
});
