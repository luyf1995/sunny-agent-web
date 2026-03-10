<template>
  <div
    class="session-item"
    :class="{ 'is-current': currentSession?.session_id === data.session_id }"
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

import MenuPopover from '@/components/menu-popover/index.vue'
import RenameSession from '../rename-session/index.vue'
import { MessageSquare, FolderPlus, Pencil, Trash2 } from 'lucide-vue-next'

import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import { SessionInfo } from '@/api/session/types'
import { deleteSession } from '@/api/session'

const props = withDefaults(
  defineProps<{
    showMenu?: boolean
    data: SessionInfo
  }>(),
  {
    showMenu: true
  }
)

const emit = defineEmits<{
  (e: 'deleted', id: string): void
  (e: 'renamed', data: SessionInfo): void
}>()

const moduleStore = useModuleStore()
const renameVisible = ref(false)

const currentSession = computed(() => moduleStore.currentSession)

const handleSelect = () => {
  moduleStore.setCurrentModuleType(ModuleType.Session)
  moduleStore.setCurrentSession(props.data)
}

const handleDelete = async (item: SessionInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteSession(item.session_id)
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

const handleRenameSuccess = (data: SessionInfo) => {
  emit('renamed', data)
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
