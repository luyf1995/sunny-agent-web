<template>
  <div class="chat-container">
    <div class="chat-main">
      <div v-if="!session && messages.length === 0" class="chat-empty">有什么我能帮你的吗？</div>
      <div v-else class="chat-message">
        <message-list :messages="messages" :is-streaming="isStreaming" />
      </div>
      <div class="chat-input-wrapper">
        <chat-input
          v-if="!showAskUser"
          v-model="message"
          :is-streaming="isStreaming"
          @send="handleSend"
          @abort="abort"
        />
        <ask-user-overlay v-else :questions="askUserQuestions!" @submit="handleAskUserSubmit" @close="clearAskUser" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, computed, watch } from 'vue'

import ChatInput from './chat-input/index.vue'
import MessageList from './message-list/index.vue'
import AskUserOverlay from './ask-user-overlay.vue'

import { useChat } from '@/hooks/use-chat'
import eventBus, { EVENT_NAMES } from '@/utils/event-bus'
import { SessionInfo } from '@/api/session/types'
import { ProjectSessionInfo } from '@/api/project/types'
import { ElMessage } from 'element-plus'

interface Props {
  session: ProjectSessionInfo | SessionInfo
}
const props = defineProps<Props>()

const {
  messages,
  isStreaming,
  sendMessage,
  abort,
  askUserQuestions,
  showAskUser,
  clearAskUser,
  getHistoryMessages,
  clearMessages,
  switchSession,
  removeSessionCache,
  hasSessionCache
} = useChat({
  onSessionCreated: session => {
    eventBus.emit(EVENT_NAMES.SESSION_UNSHIFT, session)
  },
  onMessageErrored: message => {
    ElMessage.error(message)
  }
})

provide('sendMessage', sendMessage)

const message = ref('')

watch(
  () => props.session?.session_id,
  async sessionId => {
    switchSession(sessionId)

    if (sessionId && !hasSessionCache(sessionId)) {
      getHistoryMessages(sessionId)
    } else if (!sessionId) {
      clearMessages()
    }
  },
  {
    immediate: true
  }
)

const handleSend = async () => {
  await sendMessage(props.session?.session_id, message.value)
}

const handleAskUserSubmit = async (answers: string[]) => {
  const responseText = answers
    .map((answer, index) => {
      const question = askUserQuestions.value?.[index]
      return `问题${index + 1}: ${question?.question}\n回答: ${answer}`
    })
    .join('\n\n')

  clearAskUser()
  await sendMessage(props.session?.session_id, responseText)
}
</script>
<style scoped lang="scss">
.chat-container {
  overflow: auto;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  height: 100%;

  .chat-main {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }

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

  .chat-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: 600;
    flex: 1;
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
