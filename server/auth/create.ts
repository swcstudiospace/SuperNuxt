import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { GithubOAuth } from "../../src/domain/auth";
import { openAuthDatabase } from "../db/client";
import { authSchema } from "../db/schema";

type AuthDatabase = ReturnType<typeof openAuthDatabase>;

/** Builds better-auth around an already-open database. No network until a request uses it. */
export function createBetterAuth(input: {
  readonly database: AuthDatabase;
  readonly secret: string;
  readonly github?: GithubOAuth;
}) {
  return betterAuth({
    secret: input.secret,
    telemetry: { enabled: false },
    emailAndPassword: { enabled: true },
    socialProviders: input.github
      ? {
          github: {
            clientId: input.github.clientId,
            clientSecret: input.github.clientSecret,
          },
        }
      : undefined,
    database: drizzleAdapter(input.database, {
      provider: "pg",
      schema: authSchema,
      camelCase: true,
    }),
  });
}
