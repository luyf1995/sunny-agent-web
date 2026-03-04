<template>
  <div class="message-list">
    <message-bubble v-for="item in messageList" :key="item.id" :message="item" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import MessageBubble from './message-bubble/index.vue'

const messageList = ref([
  {
    id: 'msg-1',
    role: 'user',
    content: '11'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content:
      '抱歉，生成回复时出错：litellm.APIConnectionError: AnthropicException - b\'{\\n  "error": {\\n    "type": "forbidden",\\n    "message": "Request not allowed"\\n  }\\n}\'',
    toolCalls: [],
    thinking: {
      steps: [],
      isThinking: false,
      startTime: 1772675899527,
      durationSeconds: 1
    },
    displayScenario: 'agent',
    spawnedTasks: [],
    todos: []
  }
])
</script>
<style scoped lang="scss"></style>
