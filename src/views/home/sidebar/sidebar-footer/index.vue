<template>
  <div v-memo="[collapsed]" class="sidebar-footer">
    <button-icon v-if="!collapsed" title="系统管理" class="sidebar-footer__btn">
      <settings :size="20" />
    </button-icon>
    <button-icon title="用户菜单" class="sidebar-footer__btn">
      <user :size="20" />
    </button-icon>
  </div>
</template>
<script setup lang="ts">
import ButtonIcon from '@/components/button-icon/index.vue'
import { Settings, User } from 'lucide-vue-next'
const props = defineProps<{
  collapsed: boolean
}>()
</script>
<style scoped lang="scss">
.sidebar-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  flex-direction: row;
  gap: 16px;

  &__btn {
    width: 36px;
    height: 36px;
    color: #64748b;
    transition: color 0.15s;

    &:hover {
      color: #1e293b;
    }
  }
}
</style>
