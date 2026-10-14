import { EventType, type TextAdapter } from "@tanstack/ai";
import { composeDeskReply } from "../../src/desk-reply";

interface LooseMessage {
  role?: string;
  content?: unknown;
}

function textFromContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      if ("text" in part && typeof part.text === "string") return part.text;
      if ("content" in part && typeof part.content === "string")
        return part.content;
      return "";
    })
    .join("");
}

function lastUserText(messages: LooseMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message || message.role !== "user") continue;
    const text = textFromContent(message.content).trim();
    if (text) return text;
  }
  return "";
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const deskAdapter = {
  kind: "text",
  name: "supernuxt-desk",
  model: "desk-brief-1",
  "~types": undefined as never,
  async *chatStream(options: {
    messages?: LooseMessage[];
    threadId?: string;
    runId?: string;
  }) {
    const threadId = options.threadId || "supernuxt-desk";
    const runId = options.runId || `desk-${Date.now()}`;
    const messageId = `msg-${runId}`;
    const reply = composeDeskReply(lastUserText(options.messages ?? []));

    yield {
      type: EventType.RUN_STARTED,
      threadId,
      runId,
      timestamp: Date.now(),
    };
    yield {
      type: EventType.TEXT_MESSAGE_START,
      messageId,
      role: "assistant" as const,
      timestamp: Date.now(),
    };

    for (const part of reply.split(/(\s+)/)) {
      if (!part) continue;
      yield {
        type: EventType.TEXT_MESSAGE_CONTENT,
        messageId,
        delta: part,
        timestamp: Date.now(),
      };
      await delay(8);
    }

    yield {
      type: EventType.TEXT_MESSAGE_END,
      messageId,
      timestamp: Date.now(),
    };
    yield {
      type: EventType.RUN_FINISHED,
      threadId,
      runId,
      timestamp: Date.now(),
      outcome: { type: "success" as const },
    };
  },
  async structuredOutput() {
    return { data: { ok: true }, rawText: '{"ok":true}' };
  },
} as TextAdapter<string, Record<string, never>, ["text"], never>;
