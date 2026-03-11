<template>
  <div v-if="list.length > 0" class="project-list">
    <project-item
      v-for="item in list"
      :key="item.id"
      :data="item"
      :selected="selected"
      :on-select="onSelect"
      :on-edit="onEdit"
      :on-delete="onDelete"
      :get-sessions-from-map="getSessionsFromMap"
      :fetch-sessions="fetchSessions"
      :selected-session="selectedSession"
      :on-session-select="onSessionSelect"
      :on-session-edit="onSessionEdit"
      :on-session-delete="onSessionDelete"
      :on-session-remove="onSessionRemove"
    ></project-item>
  </div>
  <div v-else class="empty">
    <folder-plus :size="24" />
    <span>暂无项目</span>
    <button-link @click="emits('to-add')">创建第一个项目</button-link>
  </div>
</template>
<script setup lang="ts">
import { FolderPlus } from 'lucide-vue-next'

import ProjectItem from '../project-item/index.vue'
import ButtonLink from '@/components/button-link/index.vue'
import { ProjectInfo, ProjectSessionInfo, SaveProjectParams } from '@/api/project/types'
import { EditSessionParams } from '@/api/session/types'

interface Props {
  list: ProjectInfo[]
  selected: ProjectInfo | null
  onSelect: (project: ProjectInfo) => void
  onEdit: (projectId: string, project: SaveProjectParams) => void
  onDelete: (projectId: string) => void
  getSessionsFromMap: (projectId: string) => ProjectSessionInfo[]
  fetchSessions: (projectId: string) => void
  selectedSession: ProjectSessionInfo | null
  onSessionSelect: (session: ProjectSessionInfo) => void
  onSessionEdit: (projectId: string, sessionId: string, session: EditSessionParams) => void
  onSessionDelete: (projectId: string, sessionId: string) => void
  onSessionRemove: (projectId: string, sessionId: string) => void
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'to-add'): void
}>()
</script>
<style scoped lang="scss">
@use './index';
</style>
