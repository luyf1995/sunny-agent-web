<template>
  <div class="sidebar" :class="{ collapsed }">
    <sidebar-header :collapsed="collapsed" @toggle-collapse="handleToggleCollapse" />
    <div class="sidebar-content">
      <sidebar-project :collapsed="collapsed" />
      <sidebar-conversation :collapsed="collapsed" />
    </div>
    <sidebar-footer :collapsed="collapsed" />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'

import SidebarHeader from './sidebar-header/index.vue'
import SidebarProject from './sidebar-project/index.vue'
import SidebarConversation from './sidebar-conversation/index.vue'
import SidebarFooter from './sidebar-footer/index.vue'

import { Local } from '@/utils/storage'

const collapsed = ref(Local.get('collapsed') || false)

/**
 * 切换侧边栏折叠状态
 */
const handleToggleCollapse = () => {
  collapsed.value = !collapsed.value
}

watch(
  collapsed,
  newValue => {
    Local.set('collapsed', newValue)
  },
  { immediate: false }
)
</script>
<style scoped lang="scss">
.sidebar {
  display: flex;
  width: 240px;
  height: 100%;
  background-color: #f1f5f9;
  transition: width 0.2s ease;
  border-right: var(--border);
  flex-direction: column;
  flex-shrink: 0;

  &.collapsed {
    width: 64px;
  }

  .sidebar-content {
    display: flex;
    overflow-y: auto;
    padding: 16px;
    flex: 1;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
