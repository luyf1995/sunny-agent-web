<template>
  <sy-dialog
    v-model="visible"
    :show-footer="false"
    :show-header="false"
    modal-class="admin-dialog"
    body-class="admin-dialog__body"
    top="10vh"
  >
    <div v-if="visible" class="admin-panel">
      <admin-sidebar v-model="currentNav" />
      <div class="content-panel">
        <div class="content-header">
          <h2 class="content-header__title">
            <component :is="currentNav?.icon" />
            {{ currentNav?.title }}
          </h2>
          <button-icon class="close-btn" @click="visible = false">
            <x :size="20" />
          </button-icon>
        </div>
        <div class="content-body">
          <component :is="currentComponent" />
        </div>
      </div>
    </div>
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, markRaw, computed } from 'vue'
import { X } from 'lucide-vue-next'

import { AdminSidebarItemKey } from './types'

import SyDialog from '@/components/sy-dialog/index.vue'
import ButtonIcon from '@/components/button-icon/index.vue'
import AdminSidebar from '@/components/admin-manage/admin-sidebar/index.vue'
import UserManage from '@/components/admin-manage/user-manage/index.vue'
import ScheduledTask from '@/components/admin-manage/scheduled-task/index.vue'

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})
const COMPONENT_MAP = {
  [AdminSidebarItemKey.User]: markRaw(UserManage),
  [AdminSidebarItemKey.ScheduledTask]: markRaw(ScheduledTask)
}
const currentNav = ref()
const currentComponent = computed(() => {
  return COMPONENT_MAP[currentNav.value?.key] || null
})
</script>
<style scoped lang="scss">
.admin-panel {
  display: flex;
  overflow: hidden;
  height: 100%;
  flex-direction: row;

  .content-panel {
    display: flex;
    overflow: hidden;
    padding: 24px;
    height: 100%;
    flex-direction: column;
    flex: 1;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-shrink: 0;

      &__title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
      }

      .close-btn {
        color: #64748b;
      }
    }

    .content-body {
      flex: 1;
    }
  }
}
</style>
<style lang="scss">
.admin-dialog {
  .el-dialog {
    padding: 0;
    width: 90%;
    max-width: 900px;
    height: 80vh;
    max-height: 700px;
  }

  .el-dialog__header,
  .el-dialog__footer {
    padding: 0;
  }

  .el-dialog__body {
    height: 100%;
  }
}
</style>
