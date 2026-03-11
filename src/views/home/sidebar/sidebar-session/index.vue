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
      <session-list :list="sessionList" @deleted="handleDeleted" @renamed="handleRenamed" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MessagesSquare, MessageSquarePlus } from 'lucide-vue-next'
import { useEventSource } from '@vueuse/core'

import ButtonIcon from '@/components/button-icon/index.vue'
import SessionList from '@/components/sessions/session-list/index.vue'
import SessionPopover from '@/components/sessions/session-popover/index.vue'

import { getSessionList } from '@/api/session'
import { SessionInfo } from '@/api/session/types'
import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import eventBus, { EVENT_NAMES } from '@/utils/event-bus'
import { ProjectSessionInfo } from '@/api/project/types'
import { buildNotifySseUrl } from '@/api/notify'

const props = defineProps<{
  collapsed: boolean
}>()

const moduleStore = useModuleStore()
const currentSession = computed(() => moduleStore.currentSession)

const { data } = useEventSource(buildNotifySseUrl())
watch(data, newData => {
  if (newData) {
    console.log(newData)
    sessionList.value.unshift(...newData)
  }
})

const sessionList = ref<SessionInfo[]>([])
/**
 * 获取对话列表
 */
const fetchSessionList = async () => {
  try {
    const { data } = await getSessionList()
    sessionList.value = data?.items ?? []
  } catch (error) {
    console.error(error)
  }
}
fetchSessionList()

/**
 * 对话列表新增
 */
eventBus.on(EVENT_NAMES.SESSION_UNSHIFT, (session: SessionInfo) => {
  sessionList.value.unshift(session)
  moduleStore.setCurrentSession(session ?? null)
})

/**
 * 项目对话列表移动
 */
eventBus.on(EVENT_NAMES.PROJECT_SESSION_MOVED, (projectSession: ProjectSessionInfo) => {
  fetchSessionList()
})

/**
 * 新建对话
 */
const handleAdd = () => {
  moduleStore.setCurrentModuleType(ModuleType.Session)
  moduleStore.setCurrentSession(null)
}

/**
 * 对话删除回调
 */
const handleDeleted = (id: string) => {
  if (currentSession.value?.session_id === id) {
    moduleStore.setCurrentSession(null)
  }
  fetchSessionList()
}

const handleRenamed = (data: SessionInfo) => {
  const index = sessionList.value.findIndex(item => item.session_id === data.session_id)
  if (index !== -1) {
    sessionList.value[index] = { ...sessionList.value[index], title: data.title }
  }
  if (currentSession.value?.session_id === data.session_id) {
    moduleStore.setCurrentSession({ ...currentSession.value, title: data.title })
  }
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
