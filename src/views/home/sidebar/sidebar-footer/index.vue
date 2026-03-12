<template>
  <div class="sidebar-footer">
    <button-icon
      v-if="!collapsed && isAdmin"
      title="插件管理"
      class="sidebar-footer__btn"
      @click="pluginManageVisible = true"
    >
      <toy-brick :size="20" />
    </button-icon>
    <button-icon
      v-if="!collapsed && isAdmin"
      title="技能管理"
      class="sidebar-footer__btn"
      @click="skillManageVisible = true"
    >
      <puzzle :size="20" />
    </button-icon>

    <button-icon
      v-if="!collapsed && isAdmin"
      title="系统管理"
      class="sidebar-footer__btn"
      @click="adminManageVisible = true"
    >
      <settings :size="20" />
    </button-icon>
    <el-popover placement="top" :width="180" trigger="click" popper-class="user-info-popover">
      <div class="user-info">
        <div class="user-item">
          <span class="user-item__label">用户类型</span>
          <span class="user-item__value">{{ userInfo?.role }}</span>
        </div>
        <div class="user-item">
          <span class="user-item__label">用户名</span>
          <span class="user-item__value">{{ userInfo?.username }}</span>
        </div>
      </div>
      <button-icon class="logout-btn" @click="userStore.logout">
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
  <plugin-manage v-model="pluginManageVisible" />
  <skill-manage v-model="skillManageVisible" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Settings, User, LogOut, Puzzle, ToyBrick } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import AdminManage from '@/components/admin-manage/index.vue'
import PluginManage from '@/components/plugin-manage/index.vue'
import SkillManage from '@/components/skill-manage/index.vue'

import { useUserStore } from '@/store'
import { UserRoleType } from '@/api/user/types'

const userStore = useUserStore()

const props = defineProps<{
  collapsed: boolean
}>()

const adminManageVisible = ref(false)
const pluginManageVisible = ref(false)
const skillManageVisible = ref(false)

const userInfo = computed(() => userStore.userInfo)

const isAdmin = computed(() => userInfo.value?.role === UserRoleType.Admin)
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
