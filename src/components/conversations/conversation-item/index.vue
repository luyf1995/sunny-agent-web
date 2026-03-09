<template>
  <div
    class="conversation-item"
    :class="{ 'is-current': currentConversation?.session_id === data.session_id }"
    @click="handleSelect"
  >
    <message-square :size="13" />
    <div class="conversation-item__label">{{ data.title }}</div>
    <div v-if="showMenu" class="conversation-item__menu">
      <menu-popover :menus="buildPopperMenus(data)"> </menu-popover>
    </div>
  </div>
  <rename-conversation v-model="renameVisible" :data="data" @success="handleRenameSuccess" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import MenuPopover from '@/components/menu-popover/index.vue'
import RenameConversation from '../rename-conversation/index.vue'
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
  (e: 'renamed', data: ConversationInfo): void
}>()

const moduleStore = useModuleStore()
const renameVisible = ref(false)

const currentConversation = computed(() => moduleStore.currentConversation)

const handleSelect = () => {
  moduleStore.setCurrentModuleType(ModuleType.Conversation)
  moduleStore.setCurrentConversation(props.data)
}

const handleDelete = async (item: ConversationInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteConversation(item.session_id)
    emit('deleted', item.session_id)
    next()
  } catch (error) {
    console.log(error)
  }
}

const handleRename = (next: () => void) => {
  renameVisible.value = true
  next()
}

const handleRenameSuccess = (data: ConversationInfo) => {
  emit('renamed', data)
}

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
      onClick: (next: () => void) => handleRename(next)
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
