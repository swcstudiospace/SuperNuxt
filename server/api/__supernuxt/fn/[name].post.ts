import { serverFns, type ServerFnName } from "../../../fns/registry";

function isServerFn(name: string): name is ServerFnName {
  return name in serverFns;
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name") ?? "";
  if (!isServerFn(name)) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown server function "${name}".`,
    });
  }
  const body = await readBody(event);
  try {
    return serverFns[name](body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error)
      throw error;
    throw createError({
      statusCode: 400,
      statusMessage:
        error instanceof Error ? error.message : "Server function failed.",
    });
  }
});
