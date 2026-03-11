<template>
  <div class="admin-sidebar">
    <div class="admin-sidebar__header">
      <h2>管理面板</h2>
    </div>
    <div class="admin-sidebar__nav">
      <div
        v-for="item in NAV_LIST"
        :key="item.key"
        class="nav-item"
        :class="{ active: item.key === currentNav?.key }"
        @click="handleSelect(item)"
      >
        <component :is="item.icon" :size="16" />
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Users, Settings, Clock } from 'lucide-vue-next'
import { AdminSidebarItem, AdminSidebarItemKey } from '../types'

const NAV_LIST = [
  {
    key: AdminSidebarItemKey.User,
    title: '用户管理',
    icon: Users
  },
  {
    key: AdminSidebarItemKey.System,
    title: '系统设置',
    icon: Settings
  },
  {
    key: AdminSidebarItemKey.ScheduledTask,
    title: '定时任务',
    icon: Clock
  }
]

const currentNav = defineModel<AdminSidebarItem>('modelValue')
currentNav.value = NAV_LIST[0]

/**
 * 选择导航项目
 * @param {AdminSidebarItem} item
 */
const handleSelect = (item: AdminSidebarItem) => {
  currentNav.value = item
}
</script>
<style scoped lang="scss">
.admin-sidebar {
  display: flex;
  width: 220px;
  min-width: 220px;
  border-right: var(--border);
  flex-direction: column;
  flex-shrink: 0;

  &__header {
    padding: 20px 20px 16px;
    border-bottom: var(--border);

    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 48px 12px 12px;

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      width: 100%;
      font-size: 14px;
      text-align: left;
      color: #64748b;
      border: none;
      border-radius: 8px;
      gap: 10px;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        color: #1e293b;
        background: #f1f5f9;
      }

      &.active {
        color: #2563eb;
        box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
      }
    }
  }
}
</style>
