<template>
  <div
    class="session-item"
    :class="{
      'is-current':
        currentModuleType === ModuleType.ProjectSession && currentProjectSession?.session_id === data.session_id
    }"
    @click="handleSelect"
  >
    <message-square :size="13" />
    <div class="session-item__label">{{ data.title }}</div>
    <div v-if="showMenu" class="session-item__menu">
      <menu-popover :menus="buildPopperMenus(data)"> </menu-popover>
    </div>
  </div>
  <rename-session v-model="renameVisible" :data="data" @success="handleRenameSuccess" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MessageSquare, FolderPlus, Pencil, Trash2, FolderMinus } from 'lucide-vue-next'

import MenuPopover from '@/components/menu-popover/index.vue'
import RenameSession from '@/components/sessions/rename-session/index.vue'

import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import { SessionInfo } from '@/api/session/types'
import { deleteSession } from '@/api/session'
import { ProjectSessionInfo } from '@/api/project/types'
import { removeSessionFromProject } from '@/api/project'

const props = withDefaults(
  defineProps<{
    showMenu?: boolean
    data: ProjectSessionInfo
  }>(),
  {
    showMenu: true
  }
)

const emit = defineEmits<{
  (e: 'deleted', id: ProjectSessionInfo): void
  (e: 'renamed', data: ProjectSessionInfo): void
  (e: 'moved', data: ProjectSessionInfo): void
}>()

const moduleStore = useModuleStore()
const renameVisible = ref(false)

const currentProjectSession = computed(() => moduleStore.currentProjectSession)
const currentModuleType = computed(() => moduleStore.currentModuleType)

const handleSelect = () => {
  moduleStore.setCurrentModuleType(ModuleType.ProjectSession)
  moduleStore.setCurrentProjectSession(props.data)
}

const handleDelete = async (item: ProjectSessionInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteSession(item.session_id)

    if (currentProjectSession.value?.session_id === item.session_id) {
      moduleStore.setCurrentProjectSession(null)
      moduleStore.setCurrentModuleType(null)
    }

    emit('deleted', item)
    next()
  } catch (error) {
    console.log(error)
  }
}

const handleRename = (next: () => void) => {
  renameVisible.value = true
  next()
}

const handleRenameSuccess = (data: ProjectSessionInfo) => {
  emit('renamed', data)
}

const handleRemoveFromProject = async (item: ProjectSessionInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要从项目移除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await removeSessionFromProject(props.data.project_id, item.session_id)

    emit('moved', item)
    next()
  } catch (error) {
    console.log(error)
  }
}

const buildPopperMenus = (item: ProjectSessionInfo) => {
  return [
    {
      icon: Pencil,
      label: '重命名',
      onClick: (next: () => void) => handleRename(next)
    },
    {
      icon: FolderMinus,
      label: '从项目移除',
      onClick: (next: () => void) => handleRemoveFromProject(item, next)
    },
    {
      icon: Trash2,
      label: '删除对话',
      onClick: (next: () => void) => handleDelete(item, next),

      style: 'color: #dc2626'
    }
  ]
}
</script>
<style scoped lang="scss">
@use './index';
</style>
