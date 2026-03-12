<template>
  <div class="sidebar-panel" :class="{ collapsed }">
    <div class="sidebar-panel__header">
      <messages-square v-if="!collapsed" :size="18" class="sidebar-panel__icon" />
      <session-popover v-else :list="sessionList">
        <template #reference="{ show }">
          <messages-square :size="20" class="sidebar-panel__icon" @click.stop="show" />
        </template>
      </session-popover>

      <template v-if="!collapsed">
        <span>对话</span>
        <button-icon title="新建对话" class="sidebar-panel__btn" @click="handleAdd">
          <message-square-plus :size="16" />
        </button-icon>
      </template>
    </div>

    <div v-if="!collapsed" class="sidebar-panel__content">
      <session-list
        :list="sessionList"
        :selected="selectedSession"
        :on-select="selectSession"
        :on-delete="doDeleteSession"
        :on-edit="doEditSession"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { MessagesSquare, MessageSquarePlus } from 'lucide-vue-next'
import { useEventSource } from '@vueuse/core'

import useSession from './use-session'

import ButtonIcon from '@/components/button-icon/index.vue'
import SessionList from '@/components/sessions/session-list/index.vue'
import SessionPopover from '@/components/sessions/session-popover/index.vue'

import { SessionInfo } from '@/api/session/types'
import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import eventBus, { EVENT_NAMES } from '@/utils/event-bus'
import { ProjectSessionInfo } from '@/api/project/types'
import { buildNotifySseUrl } from '@/api/notify'

const props = defineProps<{
  collapsed: boolean
}>()

const {
  sessionList,
  selectedSession,
  refreshSessionList,
  doEditSession,
  doDeleteSession,
  selectSession,
  setSelectedSession
} = useSession()

const moduleStore = useModuleStore()

const { data } = useEventSource(buildNotifySseUrl())
watch(data, newData => {
  if (newData) {
    try {
      refreshSessionList()
    } catch (error) {
      console.error('解析通知失败', error)
    }
  }
})

refreshSessionList()

/**
 * 对话列表新增
 */
eventBus.on(EVENT_NAMES.SESSION_UNSHIFT, (session: SessionInfo) => {
  sessionList.value.unshift(session)
  setSelectedSession(session)
})

/**
 * 项目对话列表移动
 */
eventBus.on(EVENT_NAMES.PROJECT_SESSION_MOVED, (projectSession: ProjectSessionInfo) => {
  refreshSessionList()
})

/**
 * 新建对话
 */
const handleAdd = () => {
  moduleStore.setCurrentModuleType(ModuleType.Session)
  moduleStore.setCurrentSession(null)
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
