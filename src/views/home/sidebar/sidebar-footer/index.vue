<template>
  <div v-memo="[collapsed]" class="sidebar-footer">
    <button-icon v-if="!collapsed" title="系统管理" class="sidebar-footer__btn" @click="adminManageVisible = true">
      <settings :size="20" />
    </button-icon>
    <el-popover placement="top" :width="180" trigger="click" popper-class="user-info-popover">
      <div class="user-info">
        <div class="user-item">
          <span class="user-item__label">用户类型</span>
          <span class="user-item__value">管理员</span>
        </div>
        <div class="user-item">
          <span class="user-item__label">用户名</span>
          <span class="user-item__value">admin</span>
        </div>
      </div>
      <button-icon class="logout-btn">
        <log-out :size="16" />
        退出登录
      </button-icon>
      <template #reference>
        <button-icon title="用户菜单" class="sidebar-footer__btn">
          <user :size="20" />
        </button-icon>
      </template>
    </el-popover>
  </div>
  <admin-manage v-model="adminManageVisible" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Settings, User, LogOut } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import AdminManage from '@/components/admin-manage/index.vue'

const props = defineProps<{
  collapsed: boolean
}>()

const adminManageVisible = ref(false)
</script>
<style scoped lang="scss">
.sidebar-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-top: var(--border);
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
<style lang="scss">
.user-info-popover {
  overflow: hidden;

  .user-info {
    padding: 12px 16px;
    border-bottom: var(--border);

    .user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      font-size: 13px;

      &__label {
        color: #64748b;
      }

      &__value {
        color: #1e293b;
        font-weight: 500;
      }
    }
  }

  .logout-btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 12px 16px;
    width: 100%;
    font-size: 13px;
    color: #dc2626;
    gap: 8px;

    &:hover {
      background-color: #fef2f2;
    }
  }
}
</style>
