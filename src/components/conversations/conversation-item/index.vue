<template>
  <div class="conversation-item" @click="handleSelect">
    <message-square :size="13" />
    <div class="conversation-item__label">{{ data.title }}</div>
    <div v-if="showMenu" class="conversation-item__menu">
      <menu-popover :menus="buildPopperMenus(data)"> </menu-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import MenuPopover from '@/components/menu-popover/index.vue'
import { MessageSquare, FolderPlus, Pencil, Trash2 } from 'lucide-vue-next'

import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import { ConversationInfo } from '@/api/conversation/types'
import { deleteConversation } from '@/api/conversation'

const props = withDefaults(
  defineProps<{
    showMenu?: boolean
    data: ConversationInfo
  }>(),
  {
    showMenu: true
  }
)

const emit = defineEmits<{
  (e: 'deleted', id: string): void
}>()

const moduleStore = useModuleStore()
/**
 * 选择会话
 */
const handleSelect = () => {
  moduleStore.setCurrentModuleType(ModuleType.Conversation)
  moduleStore.setCurrentConversation(props.data)
}

/**
 * 删除会话
 */
const handleDelete = async (item: ConversationInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteConversation(item.session_id)
    // ElMessage.success('删除成功')
    emit('deleted', item.session_id)
    next()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 构建弹出菜单
 * @param {ConversationInfo} item 对话项
 */
const buildPopperMenus = (item: ConversationInfo) => {
  return [
    {
      icon: FolderPlus,
      label: '添加到项目',
      onClick: (next: () => void) => {
        console.log('添加到项目')
        next()
      }
    },
    {
      icon: Pencil,
      label: '重命名',
      onClick: (next: () => void) => {
        console.log('重命名')
        next()
      }
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
