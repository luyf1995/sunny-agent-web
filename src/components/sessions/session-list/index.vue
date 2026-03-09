<template>
  <div v-if="list.length > 0" class="session-list">
    <session-item
      v-for="item in list"
      :key="item.session_id"
      :data="item"
      @deleted="handleDeleted"
      @renamed="handleRenamed"
    >
    </session-item>
  </div>
  <div v-else class="empty">
    <message-square :size="24" class="empty-icon" />
    <span>暂无对话，点击"新建对话"开始</span>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MessageSquare } from 'lucide-vue-next'

import SessionItem from '../session-item/index.vue'
import { SessionInfo } from '@/api/session/types'

import { useModuleStore } from '@/store'

const props = defineProps<{
  list: SessionInfo[]
}>()

const emit = defineEmits<{
  (e: 'deleted', id: string): void
  (e: 'renamed', data: SessionInfo): void
}>()

const moduleStore = useModuleStore()

const handleDeleted = (id: string) => {
  emit('deleted', id)
}

const handleRenamed = (data: SessionInfo) => {
  emit('renamed', data)
}
</script>
<style scoped lang="scss">
@use './index';
</style>
