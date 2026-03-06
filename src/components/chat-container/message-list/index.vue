<template>
  <div ref="containerRef" class="message-list">
    <message-bubble v-for="item in messages" :key="item.id" :message="item" :is-streaming="isStreaming" />

    <div v-if="isStreaming" class="streaming-indicator">
      <span class="dot" />
      <span class="dot" />
      <span class="dot" />
    </div>

    <div ref="footerRef"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import MessageBubble from './message-bubble.vue'

import { Message } from '@/api/chat/types'

interface Props {
  messages: Message[]
  isStreaming: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  isStreaming: false
})

const containerRef = ref<HTMLDivElement>()
const footerRef = ref<HTMLDivElement>()

watch(
  () => props.messages,
  () => {
    if (!containerRef.value) return
    const threshold = 150
    const isNearBottom =
      containerRef.value.scrollHeight - containerRef.value.scrollTop - containerRef.value.clientHeight < threshold
    console.log(11111, isNearBottom)
    if (isNearBottom) {
      footerRef.value?.scrollIntoView({ behavior: 'smooth' })
    }
  },
  {
    deep: true
  }
)
</script>
<style scoped lang="scss">
.streaming-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0 8px 44px;
}

.streaming-indicator .dot {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: pulse 1.4s infinite ease-in-out;
}

.streaming-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.streaming-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}
</style>
