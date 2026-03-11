<template>
  <div class="session-item" :class="{ 'is-current': selected?.session_id === data.session_id }" @click="onSelect(data)">
    <message-square :size="13" />
    <div class="session-item__label">{{ data.title }}</div>
    <div v-if="showMenu" class="session-item__menu">
      <menu-popover :menus="buildPopperMenus(data)"> </menu-popover>
    </div>
  </div>
  <rename-session v-model="renameVisible" :data="data" :on-edit="onEdit" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import MenuPopover from '@/components/menu-popover/index.vue'
import RenameSession from '../rename-session/index.vue'
import { MessageSquare, FolderPlus, Pencil, Trash2 } from 'lucide-vue-next'
import { EditSessionParams, SessionInfo } from '@/api/session/types'

interface Props {
  showMenu?: boolean
  data: SessionInfo
  selected: SessionInfo | null
  onSelect: (session: SessionInfo) => void
  onDelete: (sessionId: string) => void
  onEdit: (sessionId: string, session: EditSessionParams) => void
}

const props = withDefaults(defineProps<Props>(), {
  showMenu: true
})

const renameVisible = ref(false)

const handleDelete = async (item: SessionInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await props.onDelete(item.session_id)
    ElMessage.success('删除成功！')
    next()
  } catch (error) {
    console.log(error)
  }
}

const handleRename = (next: () => void) => {
  renameVisible.value = true
  next()
}

const buildPopperMenus = (item: SessionInfo) => {
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
