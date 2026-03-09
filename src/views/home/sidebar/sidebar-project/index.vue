<template>
  <div class="sidebar-panel" :class="{ collapsed }">
    <div class="sidebar-panel__header">
      <folder-kanban v-if="!collapsed" :size="18" class="sidebar-panel__icon" />

      <project-popover v-else :list="projectList">
        <template #reference="{ show }">
          <folder-kanban :size="20" class="sidebar-panel__icon" @click.stop="show" />
        </template>
      </project-popover>

      <template v-if="!collapsed">
        <span>项目</span>
        <button-icon title="新建项目" class="sidebar-panel__btn" @click="handleAddProject">
          <folder-plus :size="16" />
        </button-icon>
      </template>
    </div>
    <div v-if="!collapsed" class="sidebar-panel__content">
      <project-list :list="projectList" @add-project="handleAddProject"></project-list>
    </div>
  </div>
  <save-project
    v-model="saveDialogVisible"
    :dialog-type="saveDialogType"
    :data="saveDialogData"
    @success="fetchProjectList"
  ></save-project>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { FolderKanban, FolderPlus } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import SaveProject from '@/components/projects/save-project/index.vue'
import ProjectList from '@/components/projects/project-list/index.vue'
import ProjectPopover from '@/components/projects/project-popover/index.vue'

import { getProjectList, deleteProject } from '@/api/project'
import { ProjectInfo } from '@/api/project/types'
import { DialogTypeEnum } from '@/api/common/types'

const props = defineProps<{
  collapsed: boolean
}>()

const projectList = ref<ProjectInfo[]>([])

/**
 * 获取项目列表
 */
const fetchProjectList = async () => {
  try {
    const { data } = await getProjectList()
    projectList.value = data?.items ?? []
    console.log('projectList', projectList.value)
  } catch (error) {
    console.error(error)
  }
}
// fetchProjectList()

const saveDialogVisible = ref(false)
const saveDialogData = ref()
const saveDialogType = ref(DialogTypeEnum.ADD)

/**
 * 新增项目
 */
const handleAddProject = () => {
  saveDialogType.value = DialogTypeEnum.ADD
  saveDialogVisible.value = true
}

/**
 * 编辑项目
 * @param {ProjectInfo} project 项目信息
 */
const handleEditProject = (project: ProjectInfo) => {
  saveDialogData.value = project
  saveDialogType.value = DialogTypeEnum.EDIT
  saveDialogVisible.value = true
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
