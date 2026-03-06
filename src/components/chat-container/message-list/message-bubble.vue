<template>
  <div class="message-bubble" :class="{ 'user-bubble': isUser }">
    <div class="message-avatar">
      <component :is="isUser ? User : Bot" :size="18" />
    </div>
    <div class="message-body">
      <div v-for="(item, index) in message.contents" :key="index" class="message-content">
        <tool-call v-if="item.type === ChatSSEEvent.ToolCall && item.toolCall" :data="item.toolCall" />
        <markdown v-else :content="item.text" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { User, Bot } from 'lucide-vue-next'

import Markdown from '@/components/stream-markdown/index.vue'
import ToolCall from '../components/tool-call/index.vue'

import { Message } from '@/api/chat/types'
import { ChatSSEEvent } from '@/api/chat/event'

interface Props {
  message: Message
  isStreaming: boolean
}
const props = defineProps<Props>()

const isUser = computed(() => props.message.role === 'user')
</script>
<style scoped lang="scss">
.message-bubble {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  &.user-bubble {
    justify-content: flex-end;

    .message-avatar {
      color: #3b82f6;
      background: #eff6ff;
      border-color: #3b82f6;
    }
  }

  .message-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: #64748b;
    background: #f8fafc;
    border: var(--border);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .message-body {
    flex: 1;
    min-width: 0;
  }
}
</style>
