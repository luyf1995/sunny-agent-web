<template>
  <div v-if="list.length > 0" class="session-list">
    <session-item
      v-for="item in list"
      :key="item.session_id"
      :data="item"
      :selected="selected"
      :on-select="onSelect"
      :on-delete="onDelete"
      :on-edit="onEdit"
    >
    </session-item>
  </div>
  <div v-else class="empty">
    <message-square :size="24" class="empty-icon" />
    <span>暂无对话，点击"新建对话"开始</span>
  </div>
</template>
<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'

import SessionItem from '../session-item/index.vue'
import { EditSessionParams, SessionInfo } from '@/api/session/types'

const props = defineProps<{
  list: SessionInfo[]
  selected: SessionInfo | null
  onSelect: (session: SessionInfo) => void
  onDelete: (sessionId: string) => void
  onEdit: (sessionId: string, session: EditSessionParams) => void
}>()
</script>
<style scoped lang="scss">
@use './index';
</style>
