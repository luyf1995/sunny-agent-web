<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>Sunny Agents</h1>
      <span class="thread-id">线程: 26099b3b</span>
    </div>
    <div class="chat-message">
      <message-list :messages="messages" :is-streaming="isStreaming" />
    </div>
    <chat-input v-model="message" :is-streaming="isStreaming" @send="handleSend" @abort="abort" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

import ChatInput from './chat-input/index.vue'
import MessageList from './message-list/index.vue'

import { useChat } from '@/hooks/use-chat'

const { messages, isStreaming, threadId, sendMessage, abort } = useChat()

const message = ref('')

/**
 * 发送聊天消息
 */
const handleSend = async () => {
  await sendMessage(message.value)
}
</script>
<style scoped lang="scss">
.chat-container {
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  height: 100%;
  flex-direction: column;

  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: var(--border);
    flex-shrink: 0;

    h1 {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }

    .thread-id {
      font-size: 12px;
      color: #94a3b8;
    }
  }

  .chat-message {
    overflow-y: auto;
    padding: 20px;
    min-height: 0;
    flex: 1;
    scroll-behavior: smooth;
  }
}
</style>
