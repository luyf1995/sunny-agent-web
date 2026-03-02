<template>
  <div v-memo="[collapsed]" class="sidebar-panel" :class="{ collapsed }">
    <div class="sidebar-panel__header">
      <folder-kanban :size="collapsed ? 20 : 18" />
      <template v-if="!collapsed">
        <span>项目</span>
        <button-icon title="新建项目" class="sidebar-panel__btn">
          <folder-plus :size="16" />
        </button-icon>
      </template>
    </div>
    <div v-if="!collapsed" class="sidebar-panel__content">
      <div class="empty">
        <folder-plus :size="24" />
        <span>暂无项目</span>
        <button-link>创建第一个项目</button-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FolderKanban, FolderPlus } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import ButtonLink from '@/components/button-link/index.vue'

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
  color: #64748b;
  flex-direction: column;
  gap: 8px;
}
</style>
