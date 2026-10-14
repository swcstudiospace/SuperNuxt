<script setup lang="ts">
import { fetchServerSentEvents, useChat } from "@tanstack/ai-vue";

const input = ref("");
const { messages, sendMessage, isLoading, error, stop } = useChat({
  connection: fetchServerSentEvents("/api/chat"),
});

function textOf(part: { type?: string; content?: string; text?: string }) {
  if (part.type !== "text") return "";
  return part.content || part.text || "";
}

function send() {
  const value = input.value.trim();
  if (!value || isLoading.value) return;
  sendMessage(value);
  input.value = "";
}
</script>

<template>
  <div class="paper stack">
    <div class="chat-log" aria-live="polite">
      <p v-if="!messages.length" class="meta">
        Ask about KITE-4, Mahia, or who is on hold.
      </p>
      <article
        v-for="message in messages"
        :key="message.id"
        class="bubble"
        :class="message.role"
      >
        <template v-for="(part, index) in message.parts" :key="index">
          <p v-if="textOf(part)">{{ textOf(part) }}</p>
        </template>
      </article>
    </div>
    <p v-if="error" class="error" role="alert">
      {{ error instanceof Error ? error.message : "The desk brief failed." }}
    </p>
    <form class="row" @submit.prevent="send">
      <label style="flex: 1">
        Message
        <input v-model="input" type="text" :disabled="isLoading" />
      </label>
      <button
        v-if="isLoading"
        class="paper-button"
        type="button"
        @click="stop()"
      >
        Stop
      </button>
      <button
        v-else
        class="paper-button primary"
        type="submit"
        :disabled="!input.trim()"
      >
        Send
      </button>
    </form>
  </div>
</template>
