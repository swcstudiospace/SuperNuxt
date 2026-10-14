import {
  chat,
  chatParamsFromRequestBody,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { deskAdapter } from "../utils/desk-adapter";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const params = await chatParamsFromRequestBody(body);
    const stream = chat({
      adapter: deskAdapter,
      messages: params.messages,
    });
    return toServerSentEventsResponse(stream);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage:
        error instanceof Error ? error.message : "Chat request was rejected.",
    });
  }
});
