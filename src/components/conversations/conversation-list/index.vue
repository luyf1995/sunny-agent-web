<template>
  <div v-if="list.length > 0" class="conversation-list">
    <conversation-item
      v-for="item in list"
      :key="item.session_id"
      :data="item"
      @click="handleSelect(item)"
      @deleted="handleDeleted"
      @renamed="handleRenamed"
    >
    </conversation-item>
  </div>
  <div v-else class="empty">
    <message-square :size="24" class="empty-icon" />
    <span>暂无对话，点击"新建对话"开始</span>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MessageSquare } from 'lucide-vue-next'

import ConversationItem from '../conversation-item/index.vue'
import { ConversationInfo } from '@/api/conversation/types'

import { useModuleStore } from '@/store'

const props = defineProps<{
  list: ConversationInfo[]
}>()

const emit = defineEmits<{
  (e: 'deleted', id: string): void
  (e: 'renamed', data: ConversationInfo): void
}>()

const moduleStore = useModuleStore()

/**
 * 选择会话
 * @param {ConversationInfo} item 会话项
 */
const handleSelect = (item: ConversationInfo) => {
  moduleStore.currentConversation = item
}

/**
 * 删除会话
 * @param {string} id 会话ID
 */
const handleDeleted = (id: string) => {
  emit('deleted', id)
}

const handleRenamed = (data: ConversationInfo) => {
  emit('renamed', data)
}
</script>
<style scoped lang="scss">
@use './index';
</style>
