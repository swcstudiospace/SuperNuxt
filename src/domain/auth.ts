import {
  authSecretMinLength,
  isAuthSecret,
  isPostgresUrl,
  type ModuleEnv,
} from "./env";

export interface GithubOAuth {
  readonly clientId: string;
  readonly clientSecret: string;
}

export interface AuthActivation {
  /** Register `/api/auth/**`. Independent of whether a database is configured. */
  readonly registerRoute: boolean;
  /** Open a database. Never true during module setup or server boot. */
  readonly connect: boolean;
  readonly oauth: boolean;
  readonly reason: "disabled" | "unconfigured" | "ready";
}

export function githubOAuth(env: ModuleEnv): GithubOAuth | undefined {
  if (!env.githubClientId || !env.githubClientSecret) return undefined;
  return {
    clientId: env.githubClientId,
    clientSecret: env.githubClientSecret,
  };
}

/**
 * `auth: false` removes the route.
 * `auth: true` without a 32+ character secret and a postgres URL does not connect.
 */
export function activateAuth(enabled: boolean, env: ModuleEnv): AuthActivation {
  if (!enabled) {
    return {
      registerRoute: false,
      connect: false,
      oauth: false,
      reason: "disabled",
    };
  }
  const secretOk = isAuthSecret(env.betterAuthSecret);
  const databaseOk = isPostgresUrl(env.databaseUrl);
  const oauth = githubOAuth(env);
  if (!secretOk || !databaseOk) {
    return {
      registerRoute: true,
      connect: false,
      oauth: false,
      reason: "unconfigured",
    };
  }
  return {
    registerRoute: true,
    connect: true,
    oauth: Boolean(oauth),
    reason: "ready",
  };
}

export interface AuthHandler {
  handler: (request: Request) => Promise<Response>;
}

export interface AuthDeps<Database> {
  readonly open: (databaseUrl: string) => Database;
  readonly create: (input: {
    readonly database: Database;
    readonly secret: string;
    readonly github?: GithubOAuth;
  }) => AuthHandler;
}

export interface AuthState {
  opened: boolean;
  current: AuthHandler | null;
}

export function createAuthState(): AuthState {
  return { opened: false, current: null };
}

/** Server boot and module setup call this. It must not open a database. */
export function bootAuth(state: AuthState): void {
  if (state.opened || state.current) {
    throw new Error("Auth tried to open a database during boot.");
  }
}

export async function handleAuthRequest<Database>(
  request: Request,
  enabled: boolean,
  env: ModuleEnv,
  state: AuthState,
  deps: AuthDeps<Database>,
): Promise<Response> {
  const activation = activateAuth(enabled, env);
  if (!activation.connect || !env.databaseUrl || !env.betterAuthSecret) {
    return new Response("Auth is disabled.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  if (!state.current) {
    const database = deps.open(env.databaseUrl);
    state.opened = true;
    state.current = deps.create({
      database,
      secret: env.betterAuthSecret,
      github: activation.oauth ? githubOAuth(env) : undefined,
    });
  }
  return state.current.handler(request);
}

export const authSecretRule = `BETTER_AUTH_SECRET must be at least ${String(authSecretMinLength)} characters.`;
