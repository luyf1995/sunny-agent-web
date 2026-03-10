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
import { ref } from 'vue'
import { MessagesSquare, MessageSquarePlus } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import SessionList from '@/components/sessions/session-list/index.vue'
import SessionPopover from '@/components/sessions/session-popover/index.vue'

import { getSessionList } from '@/api/session'
import { SessionInfo } from '@/api/session/types'
import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import eventBus from '@/utils/event-bus'

const props = defineProps<{
  collapsed: boolean
}>()

const moduleStore = useModuleStore()

const sessionList = ref<SessionInfo[]>([])

const getList = async () => {
  try {
    const { data } = await getSessionList()
    sessionList.value = data?.items ?? []
  } catch (error) {
    console.error(error)
  }
}
getList()

eventBus.on('session:unshift', (session: SessionInfo) => {
  sessionList.value.unshift(session)
  moduleStore.setCurrentSession(session ?? null)
})

const handleAdd = () => {
  moduleStore.setCurrentModuleType(ModuleType.Session)
  moduleStore.setCurrentSession(null)
}

const handleDeleted = (id: string) => {
  moduleStore.setCurrentSession(null)
  getList()
}

const handleRenamed = (data: SessionInfo) => {
  const index = sessionList.value.findIndex(item => item.session_id === data.session_id)
  if (index !== -1) {
    sessionList.value[index] = { ...sessionList.value[index], title: data.title }
  }
  if (moduleStore.currentSession?.session_id === data.session_id) {
    moduleStore.setCurrentSession({ ...moduleStore.currentSession, title: data.title })
  }
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
