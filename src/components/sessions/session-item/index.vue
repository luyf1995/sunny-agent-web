<template>
  <div class="session-item" :class="{ 'is-current': selected?.session_id === data.session_id }" @click="onSelect(data)">
    <component :is="messageIcon" :size="13" />
    <div class="session-item__label">{{ data.title }}</div>
    <div v-if="data.unread" class="session-item__badge"></div>
    <div v-if="showMenu" class="session-item__menu">
      <menu-popover :menus="buildPopperMenus(data)"> </menu-popover>
    </div>
  </div>
  <rename-session v-model="renameVisible" :data="data" :on-edit="onEdit" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MessageSquare, FolderPlus, Pencil, Trash2, Clock } from 'lucide-vue-next'

import MenuPopover from '@/components/menu-popover/index.vue'
import RenameSession from '../rename-session/index.vue'
import { EditSessionParams, SessionInfo, SessionSource } from '@/api/session/types'

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

const messageIcon = computed(() => {
  return props.data?.source === SessionSource.Cron ? Clock : MessageSquare
})

const renameVisible = ref(false)

/**
 * 删除会话
 * @param {SessionInfo} item 会话信息
 * @param {() => void} next 回调函数
 */
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
/**
 * 重命名会话
 * @param {SessionInfo} item 会话信息
 * @param {() => void} next 回调函数
 */
const handleRename = (next: () => void) => {
  renameVisible.value = true
  next()
}

/**
 * 构建会话操作菜单
 * @param {SessionInfo} item 会话信息
 * @returns {MenuPopoverItem[]} 菜单列表
 */
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
