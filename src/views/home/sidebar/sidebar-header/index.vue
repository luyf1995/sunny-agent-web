<template>
  <div class="sidebar-header" :class="{ collapsed }">
    <div class="sidebar-logo" @click="handleLogoClick">
      <logo :width="24" :height="24" />
      <h1 v-if="!collapsed" class="sidebar-title">Sunny Agent</h1>
    </div>
    <!-- <button-icon v-if="!collapsed" title="收起" class="collapse-btn" @click="handleToggleCollapse">
      <panel-left-close :size="18" />
    </button-icon> -->
  </div>
</template>
<script setup lang="ts">
import { PanelLeftClose } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import Logo from '@/components/logo/index.vue'

const props = defineProps<{
  collapsed: boolean
}>()
const emit = defineEmits(['toggle-collapse'])

/**
 * 切换侧边栏收起状态
 */
const handleToggleCollapse = () => {
  emit('toggle-collapse')
}

/**
 * 处理logo点击事件
 */
const handleLogoClick = () => {
  if (props.collapsed) {
    handleToggleCollapse()
  }
}
</script>
<style scoped lang="scss">
.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-bottom: var(--border);
  gap: 12px;
}

.sidebar-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: #1e40af;
  gap: 10px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.collapse-btn {
  margin-left: auto;
  width: 32px;
  height: 32px;
  color: #64748b;
  transition: color 0.2s;

  &:hover {
    color: #1e293b;
  }
}

.collapsed {
  .sidebar-logo {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
