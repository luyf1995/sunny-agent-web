<template>
  <div class="node-item" :class="{ 'is-project': isProject }">
    <component :is="renderIcon(data)" class="node-item__icon" :size="13" />
    <div class="node-item__label">{{ data.name }}</div>
    <div v-if="showMenu" class="node-item__menu">
      <menu-popover :menus="buildMenus(data)"> </menu-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Folder, FolderMinus, FolderOpen, MessageSquare, MessageSquarePlus, Pencil, Trash2 } from 'lucide-vue-next'

import MenuPopover from '@/components/menu-popover/index.vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type: 'project' | 'conversation'
    data: any
    showMenu?: boolean
  }>(),
  {
    showMenu: true
  }
)

const isProject = computed(() => props.type === 'project')

/**
 * 渲染节点图标
 */
const renderIcon = node => {
  if (isProject.value) {
    return node.isExpanded ? FolderOpen : Folder
  }
  return MessageSquare
}
/**
 * 构建菜单项
 */
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
.node-item {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  height: 32px;
  cursor: pointer;

  &.is-project {
    height: 38px;
  }

  &:hover {
    .node-item__menu {
      opacity: 1;
    }
  }

  &__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  &__menu {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.15s;
  }
}
</style>
