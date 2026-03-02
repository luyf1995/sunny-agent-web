<template>
  <div v-if="list.length > 0" class="conversation-list">
    <conversation-item
      v-for="item in list"
      :key="item.name"
      :data="item"
      :class="{ 'is-current': item.name === current?.name }"
      @click="current = item"
    >
    </conversation-item>
  </div>
  <div v-else class="empty">
    <message-square :size="24" class="empty-icon" />
    <span>暂无对话，点击"新建对话"开始</span>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { MessageSquare } from 'lucide-vue-next'

import ConversationItem from './conversation-item.vue'

interface Conversation {
  name: string
}

const props = defineProps<{
  list: Conversation[]
}>()

const current = ref<Conversation>()
</script>
<style scoped lang="scss">
.conversation-list {
  font-size: 13px;
  color: #64748b;

  .is-current {
    color: #1e293b;
    background-color: #d6e3f9;
  }
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;
  font-size: 13px;
  text-align: center;
  flex-direction: column;
  gap: 8px;
  color: #64748b;

  .empty-icon {
    opacity: 0.5;
  }

  span {
    line-height: 1.5;
  }
}
</style>
