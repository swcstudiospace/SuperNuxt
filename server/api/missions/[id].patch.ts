import { parseStatusChange } from "../../../src/domain/ledger";
import { ledger } from "../../ledger";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const parsed = parseStatusChange({ ...(body ?? {}), id });
  if (!parsed.ok) {
    throw createError({ statusCode: 400, statusMessage: parsed.message });
  }
  const result = ledger.apply(parsed.change);
  if (!result.ok) {
    throw createError({ statusCode: 404, statusMessage: "Unknown mission" });
  }
  return result.mission;
});
