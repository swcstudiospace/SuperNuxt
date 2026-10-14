import { dispatchServerFn } from "../../../../src/domain/contracts";
import { ledger } from "../../../ledger";

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name") ?? "";
  const body = await readBody(event);
  const result = dispatchServerFn(name, body, ledger.list());
  if (!result.ok) {
    throw createError({
      statusCode: result.status,
      statusMessage: result.message,
    });
  }
  return result.value;
});
