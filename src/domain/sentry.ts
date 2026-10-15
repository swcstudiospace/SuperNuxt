import type { ModuleEnv } from "./env";

/**
 * Client and server SDK options used only when a DSN is present.
 * Tracing and replay are omitted so those integrations stay off.
 */
export interface SentryInitOptions {
  readonly dsn: string;
  readonly sendDefaultPii: false;
}

export interface SentryPlan {
  readonly install: boolean;
  readonly telemetry: false;
  readonly uploadSourceMaps: boolean;
  readonly tracing: false;
  readonly replay: false;
  readonly init: SentryInitOptions | null;
}

export function planSentry(enabled: boolean, env: ModuleEnv): SentryPlan {
  const dsn = env.sentryDsn;
  const install = enabled && typeof dsn === "string";
  return {
    install,
    telemetry: false,
    uploadSourceMaps: install && typeof env.sentryAuthToken === "string",
    tracing: false,
    replay: false,
    init: install && dsn ? { dsn, sendDefaultPii: false } : null,
  };
}

/** Calls `init` only when the plan has a DSN. A missing DSN is a no-op. */
export function initSentry(
  plan: SentryPlan,
  init: (options: SentryInitOptions) => void,
): boolean {
  if (!plan.install || !plan.init) return false;
  if (plan.tracing || plan.replay) {
    throw new Error(
      "Sentry tracing and replay stay off unless a later change enables them.",
    );
  }
  init(plan.init);
  return true;
}
