<template>
  <div class="node-item-container">
    <div class="node-item" :class="{ 'is-project': isProject }" @click="handleSelect">
      <component :is="renderIcon(data)" class="node-item__icon" :size="13" />
      <div class="node-item__label">{{ data.name }}</div>
      <div v-if="showMenu" class="node-item__menu">
        <menu-popover :menus="buildMenus(data)"> </menu-popover>
      </div>
    </div>
  </div>
  <save-project
    v-if="isProject"
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
import { Folder, FolderMinus, FolderOpen, MessageSquare, MessageSquarePlus, Pencil, Trash2 } from 'lucide-vue-next'
import { useModuleStore } from '@/store'

import MenuPopover from '@/components/menu-popover/index.vue'
import SaveProject from '../save-project/index.vue'
import { ModuleType } from '@/store/module'
import { DialogTypeEnum } from '@/api/common/types'
import { deleteProject } from '@/api/project'
import { ProjectInfo } from '@/api/project/types'

const props = withDefaults(
  defineProps<{
    type: ModuleType
    data: any
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

const isProject = computed(() => props.type === ModuleType.Project)
const saveProjectVisible = ref(false)
const saveProjectData = ref<ProjectInfo>()

const handleSelect = () => {
  if (isProject.value) {
    moduleStore.setCurrentModuleType(ModuleType.Project)
    moduleStore.setCurrentProject(props.data)
  } else {
    moduleStore.setCurrentModuleType(ModuleType.ProjectSession)
    moduleStore.setCurrentProjectSession(props.data)
  }
}

const renderIcon = node => {
  if (isProject.value) {
    return node.isExpanded ? FolderOpen : Folder
  }
  return MessageSquare
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
  if (isProject.value) {
    return [
      {
        icon: MessageSquarePlus,
        label: '新建对话',
        onClick: (next: () => void) => {
          console.log('新建对话')
          next()
        }
      },
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
  return [
    {
      icon: Pencil,
      label: '重命名',
      onClick: (next: () => void) => {
        console.log('重命名')
        next()
      }
    },
    {
      icon: FolderMinus,
      label: '从项目移除',
      onClick: (next: () => void) => {
        console.log('从项目移除')
        next()
      }
    },
    {
      icon: Trash2,
      label: '删除对话',
      onClick: (next: () => void) => {
        console.log('删除对话')
        next()
      },
      style: 'color: #dc2626'
    }
  ]
}
</script>
<style scoped lang="scss">
@use './index';
</style>
