<template>
  <div class="node-item" :class="{ 'is-project': isProject }" @click="handleSelect">
    <component :is="renderIcon(data)" class="node-item__icon" :size="13" />
    <div class="node-item__label">{{ data.name }}</div>
    <div v-if="showMenu" class="node-item__menu">
      <menu-popover :menus="buildMenus(data)"> </menu-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Folder, FolderMinus, FolderOpen, MessageSquare, MessageSquarePlus, Pencil, Trash2 } from 'lucide-vue-next'
import { useModuleStore } from '@/store'

import MenuPopover from '@/components/menu-popover/index.vue'
import { ModuleType } from '@/store/module'

const props = withDefaults(
  defineProps<{
    type: 'project' | 'session'
    data: any
    showMenu?: boolean
  }>(),
  {
    showMenu: true
  }
)

const moduleStore = useModuleStore()

const isProject = computed(() => props.type === 'project')

const handleSelect = () => {
  moduleStore.setCurrentModule(isProject.value ? ModuleType.Project : ModuleType.ProjectSession, props.data)
}

const renderIcon = node => {
  if (isProject.value) {
    return node.isExpanded ? FolderOpen : Folder
  }
  return MessageSquare
}

const buildMenus = (data: any) => {
  if (isProject.value) {
    return [
      {
        icon: MessageSquarePlus,
        label: '新建对话',
        onClick: next => {
          console.log('新建对话')
          next()
        }
      },
      {
        icon: Pencil,
        label: '重命名',
        onClick: next => {
          console.log('重命名')
          next()
        }
      },
      {
        icon: Trash2,
        label: '删除项目',
        onClick: next => {
          console.log('删除项目')
          next()
        },
        style: 'color: #dc2626'
      }
    ]
  }
  return [
    {
      icon: Pencil,
      label: '重命名',
      onClick: next => {
        console.log('重命名')
        next()
      }
    },
    {
      icon: FolderMinus,
      label: '从项目移除',
      onClick: next => {
        console.log('从项目移除')
        next()
      }
    },
    {
      icon: Trash2,
      label: '删除对话',
      onClick: next => {
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
