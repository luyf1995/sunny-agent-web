<template>
  <div class="project-item-container">
    <div
      class="project-item"
      :class="{
        'is-current': currentModuleType === ModuleType.Project && selected?.id === data.id
      }"
      @click="onSelect(data)"
    >
      <div class="project-item__expend" @click.stop="data.session_count > 0 ? handleToggle() : null">
        <template v-if="data.session_count > 0">
          <chevron-right v-if="!isExpended" :size="13" class="project-item__expend" />
          <chevron-down v-else :size="13" class="project-item__expend" />
        </template>
      </div>

      <folder class="project-item__icon" :size="13" />
      <div class="project-item__label">{{ data.name }}</div>
      <div v-if="showMenu" class="project-item__menu">
        <menu-popover :menus="buildMenus(data)"> </menu-popover>
      </div>
    </div>
    <div v-if="isExpended" class="project-sessions-container">
      <project-session-item
        v-for="item in getSessionsFromMap(data.id)"
        :key="item.id"
        :data="item"
        :selected="selectedSession"
        :on-select="onSessionSelect"
        :on-edit="onSessionEdit"
        :on-delete="onSessionDelete"
        :on-remove="onSessionRemove"
      />
    </div>
  </div>
  <save-project
    v-model="saveProjectVisible"
    :dialog-type="DialogTypeEnum.EDIT"
    :data="saveProjectData"
    :on-edit="onEdit"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-vue-next'
import { useModuleStore } from '@/store'

import MenuPopover from '@/components/menu-popover/index.vue'
import SaveProject from '../save-project/index.vue'
import ProjectSessionItem from '../project-session-item/index.vue'
import eventBus, { EVENT_NAMES } from '@/utils/event-bus'

import { ModuleType } from '@/store/module'
import { DialogTypeEnum } from '@/api/common/types'
import { ProjectInfo, ProjectSessionInfo, SaveProjectParams } from '@/api/project/types'
import { EditSessionParams } from '@/api/session/types'

interface Props {
  data: ProjectInfo
  showMenu?: boolean
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

const props = withDefaults(defineProps<Props>(), {
  showMenu: true
})

const moduleStore = useModuleStore()
const currentModuleType = computed(() => moduleStore.currentModuleType)

const saveProjectVisible = ref(false)
const saveProjectData = ref<ProjectInfo>()

/**
 * 保存项目
 * @param {ProjectInfo} data 项目信息
 * @param {() => void} next 回调函数
 */
const handleSave = (data: ProjectInfo, next: () => void) => {
  saveProjectData.value = { ...data }
  saveProjectVisible.value = true
  next()
}

/**
 * 删除项目
 * @param {ProjectInfo} item 项目信息
 * @param {() => void} next 回调函数
 */
const handleDelete = async (item: ProjectInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await props.onDelete(item.id)
    ElMessage.success('删除成功！')
    next()
  } catch (error) {
    console.log(error)
  }
}

const buildMenus = (data: any) => {
  return [
    {
      icon: Pencil,
      label: '重命名',
      onClick: (next: () => void) => handleSave(data, next)
    },
    {
      icon: Trash2,
      label: '删除项目',
      onClick: (next: () => void) => handleDelete(data, next),
      style: 'color: #dc2626'
    }
  ]
}

const isExpended = ref(false)
const isLoading = ref(false)
const projectSessions = ref<ProjectSessionInfo[]>([])

const handleToggle = () => {
  isExpended.value = !isExpended.value
  if (projectSessions.value.length === 0) {
    props.fetchSessions(props.data.id)
  }
}

eventBus.on(EVENT_NAMES.PROJECT_SESSION_CREATED, (data: ProjectSessionInfo) => {
  if (props.data.id !== data.project_id) return
  if (!isExpended.value) {
    isExpended.value = true
  }
  props.fetchSessions(data.project_id)
})
</script>
<style scoped lang="scss">
@use './index';
</style>
