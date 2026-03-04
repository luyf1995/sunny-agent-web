<template>
  <div class="message-bubble">
    <div class="message-avatar">
      <component :is="message.role === 'user' ? User : Bot" />
    </div>
    <div class="message-content"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { User, Bot } from 'lucide-vue-next'

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
}
</style>
