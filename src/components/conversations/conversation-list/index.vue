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

import ConversationItem from '../conversation-item/index.vue'

interface Conversation {
  name: string
}

const props = defineProps<{
  list: Conversation[]
}>()

const current = ref<Conversation>()
</script>
<style scoped lang="scss">
@use './index';
</style>
