import { defineEventHandler, sendWebResponse, toWebRequest } from "h3";
import {
  bootAuth,
  createAuthState,
  handleAuthRequest,
} from "../../../src/domain/auth";
import { readModuleEnv } from "../../../src/domain/env";
import { createBetterAuth } from "../../../server/auth/create";
import { openAuthDatabase } from "../../../server/db/client";

const state = createAuthState();
bootAuth(state);

/**
 * Registered only when `supernuxt.auth` is true.
 * A request still returns 404 without opening Postgres until the secret and
 * DATABASE_URL are both set.
 */
export default defineEventHandler(async (event) => {
  const response = await handleAuthRequest(
    toWebRequest(event),
    true,
    readModuleEnv(process.env),
    state,
    {
      open: openAuthDatabase,
      create: createBetterAuth,
    },
  );
  return sendWebResponse(event, response);
});
