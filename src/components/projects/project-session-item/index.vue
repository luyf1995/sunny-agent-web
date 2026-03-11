<template>
  <div
    class="session-item"
    :class="{
      'is-current': currentModuleType === ModuleType.ProjectSession && selected?.session_id === data.session_id
    }"
    @click="onSelect(data)"
  >
    <message-square :size="13" />
    <div class="session-item__label">{{ data.title }}</div>
    <div v-if="showMenu" class="session-item__menu">
      <menu-popover :menus="buildPopperMenus(data)"> </menu-popover>
    </div>
  </div>
  <rename-session
    v-model="renameVisible"
    :data="data"
    :on-edit="(sessionId: string, params: EditSessionParams) => onEdit(data.project_id, sessionId, params)"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MessageSquare, Pencil, Trash2, FolderMinus } from 'lucide-vue-next'

import MenuPopover from '@/components/menu-popover/index.vue'
import RenameSession from '@/components/sessions/rename-session/index.vue'

import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import { EditSessionParams } from '@/api/session/types'
import { ProjectSessionInfo } from '@/api/project/types'

interface Props {
  showMenu?: boolean
  data: ProjectSessionInfo
  selected: ProjectSessionInfo | null
  onSelect: (item: ProjectSessionInfo) => void
  onEdit: (projectId: string, sessionId: string, item: EditSessionParams) => void
  onDelete: (projectId: string, sessionId: string) => void
  onRemove: (projectId: string, sessionId: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  showMenu: true
})

const moduleStore = useModuleStore()
const renameVisible = ref(false)

const currentModuleType = computed(() => moduleStore.currentModuleType)

const handleDelete = async (item: ProjectSessionInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await props.onDelete(props.data.project_id, item.session_id)
    ElMessage.success('删除成功')
    next()
  } catch (error) {
    console.log(error)
  }
}

const handleRename = (next: () => void) => {
  renameVisible.value = true
  next()
}

/**
 * 从项目移除会话
 * @param {ProjectSessionInfo} item 会话信息
 * @param {() => void} next 回调函数
 */
const handleRemoveFromProject = async (item: ProjectSessionInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要从项目移除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await props.onRemove(props.data.project_id, item.session_id)
    ElMessage.success('移除成功')
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
