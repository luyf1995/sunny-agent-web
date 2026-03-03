<template>
  <div class="conversation-item" @click="handleSelect">
    <message-square :size="13" />
    <div class="conversation-item__label">{{ data.name }}</div>
    <div v-if="showMenu" class="conversation-item__menu">
      <menu-popover :menus="buildPopperMenus(data)"> </menu-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import MenuPopover from '@/components/menu-popover/index.vue'
import { MessageSquare, FolderPlus, Pencil, Trash2 } from 'lucide-vue-next'

import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'

interface Conversation {
  name: string
}

const props = withDefaults(
  defineProps<{
    showMenu?: boolean
    data: Conversation
  }>(),
  {
    showMenu: true
  }
)

const moduleStore = useModuleStore()
/**
 * 选择
 */
const handleSelect = () => {
  moduleStore.setCurrentModule(ModuleType.Conversation, props.data)
}

/**
 * 构建弹出菜单
 * @param {Conversation} item 对话项
 */
const buildPopperMenus = (item: Conversation) => {
  return [
    {
      icon: FolderPlus,
      label: '添加到项目',
      onClick: next => {
        console.log('添加到项目')
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
