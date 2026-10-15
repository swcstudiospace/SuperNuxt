/**
 * Environment values the optional modules are allowed to read.
 * Empty strings and the documented placeholders count as unset.
 * Secret values are not rewritten into error messages.
 */
export interface ModuleEnv {
  readonly sentryDsn?: string;
  readonly sentryAuthToken?: string;
  readonly betterAuthSecret?: string;
  readonly databaseUrl?: string;
  readonly githubClientId?: string;
  readonly githubClientSecret?: string;
}

const placeholders = new Set([
  "replace-me",
  "changeme",
  "your-dsn",
  "your-secret",
  "your-database-url",
  "your-client-id",
  "your-client-secret",
]);

export function presentEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (placeholders.has(trimmed.toLowerCase())) return undefined;
  return trimmed;
}

export function readModuleEnv(
  env: Record<string, string | undefined>,
): ModuleEnv {
  return {
    sentryDsn: presentEnv(env.SENTRY_DSN),
    sentryAuthToken: presentEnv(env.SENTRY_AUTH_TOKEN),
    betterAuthSecret:
      presentEnv(env.BETTER_AUTH_SECRET) ?? presentEnv(env.AUTH_SECRET),
    databaseUrl: presentEnv(env.DATABASE_URL),
    githubClientId: presentEnv(env.BETTER_AUTH_GITHUB_CLIENT_ID),
    githubClientSecret: presentEnv(env.BETTER_AUTH_GITHUB_CLIENT_SECRET),
  };
}

/** A postgres URL is the only database string the auth layer will accept. */
export function isPostgresUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "postgres:" || url.protocol === "postgresql:";
  } catch {
    return false;
  }
}

export const authSecretMinLength = 32;

export function isAuthSecret(value: string | undefined): value is string {
  return typeof value === "string" && value.length >= authSecretMinLength;
}
