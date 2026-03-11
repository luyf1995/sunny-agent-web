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
      <project-list
        ref="projectListRef"
        :list="projectList"
        :selected="selectedProject"
        :on-select="selectProject"
        :on-edit="doEditProject"
        :on-delete="doDeleteProject"
        :get-sessions-from-map="getProjectSessionsFromMap"
        :fetch-sessions="fetchProjectSessions"
        :selected-session="selectedProjectSession"
        :on-session-select="selectProjectSession"
        :on-session-edit="doEditProjectSession"
        :on-session-delete="doDeleteProjectSession"
        :on-session-remove="doRemoveSessionFromProject"
        @to-add="handleAddProject"
      ></project-list>
    </div>
  </div>
  <save-project
    v-model="saveDialogVisible"
    :dialog-type="saveDialogType"
    :data="saveDialogData"
    :on-create="doCreateProject"
  ></save-project>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { FolderKanban, FolderPlus } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import SaveProject from '@/components/projects/save-project/index.vue'
import ProjectList from '@/components/projects/project-list/index.vue'
import ProjectPopover from '@/components/projects/project-popover/index.vue'

import useProject from './use-project'
import { DialogTypeEnum } from '@/api/common/types'

const props = defineProps<{
  collapsed: boolean
}>()

const {
  projectList,
  selectedProject,
  refreshProjectList,
  doCreateProject,
  doEditProject,
  doDeleteProject,
  selectProject,
  setSelectedProject,
  projectSessionsMap,
  selectedProjectSession,
  getProjectSessionsFromMap,
  fetchProjectSessions,
  selectProjectSession,
  setSelectedProjectSession,
  doEditProjectSession,
  doDeleteProjectSession,
  doRemoveSessionFromProject
} = useProject()
refreshProjectList()

const saveDialogVisible = ref(false)
const saveDialogData = ref()
const saveDialogType = ref(DialogTypeEnum.ADD)

/**
 * 新建项目
 */
const handleAddProject = () => {
  saveDialogType.value = DialogTypeEnum.ADD
  saveDialogVisible.value = true
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
