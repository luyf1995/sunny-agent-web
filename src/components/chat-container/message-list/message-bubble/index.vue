<template>
  <div class="message-bubble" :class="{ 'user-bubble': message.role === 'user' }">
    <div class="message-avatar">
      <component :is="message.role === 'user' ? User : Bot" :size="18" />
    </div>
    <div class="message-body">
      <div class="message-content">
        <markdown :message="message.content" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { User, Bot } from 'lucide-vue-next'
import Markdown from '../../components/markdown/index.vue'

interface Message {
  id: string
  role: string
  content: string
}

interface Props {
  message: Message
}

const props = defineProps<Props>()
</script>
<style scoped lang="scss">
.message-bubble {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  &.user-bubble {
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
