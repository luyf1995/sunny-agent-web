<template>
  <div v-memo="[collapsed]" class="sidebar-panel" :class="{ collapsed }">
    <div class="sidebar-panel__header">
      <messages-square :size="collapsed ? 20 : 18" />
      <template v-if="!collapsed">
        <span>对话</span>
        <button-icon title="新建对话" class="sidebar-panel__btn">
          <message-square-plus :size="16" />
        </button-icon>
      </template>
    </div>
    <div v-if="!collapsed" class="sidebar-panel__content">
      <div class="empty">
        <message-square :size="24" class="empty-icon" />
        <span>暂无对话，点击"新建对话"开始</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessagesSquare, MessageSquarePlus, MessageSquare } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'

const props = defineProps<{
  collapsed: boolean
}>()
</script>
<style scoped lang="scss">
@use '../sidebar-panel';

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
