import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authSchema } from "./schema";

/**
 * Opens a postgres.js client. Call this only from the auth request path.
 * Importing this module does not connect.
 */
export function openAuthDatabase(databaseUrl: string) {
  const client = postgres(databaseUrl, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return drizzle(client, { schema: authSchema });
}
