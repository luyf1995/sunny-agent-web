<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>Sunny Agents</h1>
      <span class="thread-id">线程: 26099b3b</span>
    </div>
    <div class="chat-message">
      <message-list :messages="messages" :is-streaming="isStreaming" />
    </div>
    <div class="chat-input-wrapper">
      <chat-input v-if="!showAskUser" v-model="message" :is-streaming="isStreaming" @send="handleSend" @abort="abort" />
      <ask-user-overlay v-else :questions="askUserQuestions!" @submit="handleAskUserSubmit" @close="clearAskUser" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'

import ChatInput from './chat-input/index.vue'
import MessageList from './message-list/index.vue'
import AskUserOverlay from './ask-user-overlay.vue'

import { useChat } from '@/hooks/use-chat'

const { messages, isStreaming, threadId, sendMessage, abort, askUserQuestions, showAskUser, clearAskUser } = useChat()

const message = ref('')

provide('sendMessage', sendMessage)

const handleSend = async () => {
  await sendMessage(message.value)
}

const handleAskUserSubmit = async (answers: string[]) => {
  const responseText = answers
    .map((answer, index) => {
      const question = askUserQuestions.value?.[index]
      return `问题${index + 1}: ${question?.question}\n回答: ${answer}`
    })
    .join('\n\n')

  clearAskUser()
  await sendMessage(responseText)
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

  .chat-input-wrapper {
    position: relative;
    flex-shrink: 0;
  }
}
</style>
