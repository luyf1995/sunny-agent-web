<template>
  <div class="database-layout">
    <div class="database-header">
      <div class="database-header__title">
        <span>资料库</span>
        <span v-if="selectedList.length" class="database-header__selected">已选 {{ selectedList.length }} 个</span>
      </div>
      <!-- <button-icon>
        <lucide-chevron-left />
      </button-icon> -->
    </div>
    <div class="database-action">
      <el-button type="primary" class="action-btn" @click="uploadFileDialogVisible = true">
        <plus :size="16" />
        添加资料
      </el-button>
    </div>
    <div class="databbase-check-all">
      <button @click="handleSelectAll">
        <span>全选</span>
        <component :is="isSelectAll ? SquareCheckBig : Square" :size="16" />
      </button>
    </div>
    <div class="database-list">
      <div
        v-for="item in fileList"
        :key="item.id"
        class="database-item"
        :class="{ selected: isSelected(item.id) }"
        @click="handleSelect(item)"
      >
        <div class="database-item__menu">
          <menu-popover :menus="buildMenus(item)" :width="120" placement="right-start"></menu-popover>
        </div>
        <div class="database-item__icon">
          <file-text :size="18"></file-text>
        </div>
        <div class="database-item__info">
          <span class="database-item__name">{{ item.file_name }}</span>
          <span class="database-item__meta">{{ item.file_size }} B</span>
        </div>
        <div class="database-item__check">
          <component :is="isSelected(item.id) ? SquareCheckBig : Square" :size="16" />
        </div>
      </div>
    </div>
  </div>
  <upload-file
    v-if="projectSession"
    v-model="uploadFileDialogVisible"
    :project-id="projectSession.project_id"
    @success="fetchProjectFiles"
  ></upload-file>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { LucideChevronLeft, Plus, Square, SquareCheckBig, FileText, Pencil, Trash2 } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import MenuPopover from '@/components/menu-popover/index.vue'
import UploadFile from '../upload-file/index.vue'

import { ProjectFileInfo, ProjectInfo, ProjectSessionInfo } from '@/api/project/types'
import { deleteProjectFile, getProjectFiles } from '@/api/project'

interface Props {
  projectSession: ProjectSessionInfo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'deleted', id: string): void
}>()

const uploadFileDialogVisible = ref(false)

const fileList = ref<ProjectFileInfo[]>([])

const selectedList = ref<string[]>([])

const fetchProjectFiles = async () => {
  try {
    if (props.projectSession) {
      console.log('props', props.projectSession)
      const { data } = await getProjectFiles(props.projectSession.project_id)
      fileList.value = data.items || []
    }
  } catch (error) {
    console.error('获取项目文件失败', error)
  }
}

watch(
  () => props.projectSession,
  () => fetchProjectFiles(),
  {
    immediate: true
  }
)

/**
 * 单个选择
 * @param {*} item
 */
const handleSelect = item => {
  if (selectedList.value.includes(item.id)) {
    selectedList.value = selectedList.value.filter(id => id !== item.id)
  } else {
    selectedList.value.push(item.id)
  }
}
/**
 * 是否选中
 * @param {number} id
 */
const isSelected = id => {
  return selectedList.value.includes(id)
}

const isSelectAll = computed(() => {
  const selectedLength = selectedList.value.length
  return selectedLength > 0 && selectedLength === fileList.value.length
})

/**
 * 全选
 */
const handleSelectAll = () => {
  if (isSelectAll.value) {
    selectedList.value = []
  } else {
    selectedList.value = fileList.value.map(item => item.id)
  }
}

/**
 * 构建菜单
 */
const buildMenus = (data: ProjectFileInfo) => {
  return [
    // {
    //   icon: Pencil,
    //   label: '重命名',
    //   onClick: next => {
    //     console.log('重命名')
    //     next()
    //   }
    // },
    {
      icon: Trash2,
      label: '删除',
      onClick: (next: () => void) => handleDelete(data, next),

      style: {
        color: '#e53e3e'
      }
    }
  ]
}

const handleDelete = async (item: ProjectFileInfo, next: () => void) => {
  try {
    await ElMessageBox.confirm('确定要删除该文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteProjectFile(props.projectSession.project_id, item.id)
    fetchProjectFiles()
    emit('deleted', item.id)
    next()
  } catch (error) {
    console.log(error)
  }
}
</script>
<style scoped lang="scss">
@use './index';
</style>
