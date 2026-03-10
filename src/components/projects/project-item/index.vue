<template>
  <div class="project-item-container">
    <div
      class="project-item"
      :class="{
        'is-current': currentModuleType === ModuleType.Project && currentProject?.id === data.id
      }"
      @click="handleSelect"
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
        v-for="item in projectSessions"
        :key="item.id"
        :data="item"
        @renamed="handleSessionRenamed"
        @moved="handleSessionMoved"
        @deleted="handleSessionDeleted"
      />
    </div>
  </div>
  <save-project
    v-model="saveProjectVisible"
    :dialog-type="DialogTypeEnum.EDIT"
    :data="saveProjectData"
    @click.stop
    @success="handleSaveSuccess"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import {
  Folder,
  FolderMinus,
  FolderOpen,
  MessageSquare,
  MessageSquarePlus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown
} from 'lucide-vue-next'
import { useModuleStore } from '@/store'

import MenuPopover from '@/components/menu-popover/index.vue'
import SaveProject from '../save-project/index.vue'
import ProjectSessionItem from '../project-session-item/index.vue'
import eventBus, { EVENT_NAMES } from '@/utils/event-bus'

import { ModuleType } from '@/store/module'
import { DialogTypeEnum } from '@/api/common/types'
import { deleteProject, getProjectSessions } from '@/api/project'
import { ProjectInfo, ProjectSessionInfo } from '@/api/project/types'

const props = withDefaults(
  defineProps<{
    data: ProjectInfo
    showMenu?: boolean
  }>(),
  {
    showMenu: true
  }
)

const emit = defineEmits<{
  (e: 'deleted', id: string): void
  (e: 'renamed', data: ProjectInfo): void
}>()

const moduleStore = useModuleStore()
const currentProject = computed(() => moduleStore.currentProject)
const currentModuleType = computed(() => moduleStore.currentModuleType)

const saveProjectVisible = ref(false)
const saveProjectData = ref<ProjectInfo>()

const handleSelect = () => {
  moduleStore.setCurrentModuleType(ModuleType.Project)
  moduleStore.setCurrentProject(props.data)
}
const handleSave = (data: ProjectInfo, next: () => void) => {
  saveProjectData.value = { ...data }
  saveProjectVisible.value = true
  next()
}

const handleSaveSuccess = (data: ProjectInfo) => {
  emit('renamed', data)
}

const handleDelete = async (item: ProjectInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteProject(item.id)
    emit('deleted', item.id)
    next()
  } catch (error) {
    console.log(error)
  }
}

const buildMenus = (data: any) => {
  return [
    // {
    //   icon: MessageSquarePlus,
    //   label: '新建对话',
    //   onClick: (next: () => void) => {
    //     console.log('新建对话')
    //     next()
    //   }
    // },
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
    fetchProjectSessions(props.data.id)
  }
}

/**
 * 获取项目会话
 */
const fetchProjectSessions = async (projectId: string) => {
  try {
    isLoading.value = true
    const { data } = await getProjectSessions(projectId)
    projectSessions.value = data.items ?? []

    props.data.session_count = projectSessions.value.length
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

eventBus.on(EVENT_NAMES.PROJECT_SESSION_CREATED, (data: ProjectSessionInfo) => {
  // if (data.project_id === props.data.id) {
  //   projectSessions.value.push(data)
  // }

  if (props.data.id !== data.project_id) return

  if (!isExpended.value) {
    isExpended.value = true
  }

  fetchProjectSessions(data.project_id)
})

/**
 * 会话重命名
 * @param {ProjectSessionInfo} data 会话信息
 */
const handleSessionRenamed = (data: ProjectSessionInfo) => {
  const index = projectSessions.value.findIndex(item => item.id === data.id)
  if (index !== -1) {
    projectSessions.value[index] = data
  }
}
/**
 * 会话移出项目
 *  @param {ProjectSessionInfo} data 会话信息
 */
const handleSessionMoved = (data: ProjectSessionInfo) => {
  projectSessions.value = projectSessions.value.filter(item => item.session_id !== data.session_id)

  // TODO: 不合法的修改，后续优化
  props.data.session_count = projectSessions.value.length

  eventBus.emit(EVENT_NAMES.PROJECT_SESSION_MOVED, data)
}
/**
 * 会话删除
 *  @param {ProjectSessionInfo} data 会话信息
 */
const handleSessionDeleted = (data: ProjectSessionInfo) => {
  // TODO: 不合法的修改，后续优化
  projectSessions.value = projectSessions.value.filter(item => item.session_id !== data.session_id)
  props.data.session_count = projectSessions.value.length
}
</script>
<style scoped lang="scss">
@use './index';
</style>
