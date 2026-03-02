<template>
  <div v-memo="[collapsed]" class="sidebar-panel" :class="{ collapsed }">
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
  <add-project v-model="addDialogVisible"></add-project>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { FolderKanban, FolderPlus } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import AddProject from '@/components/projects/add-project.vue'
import ProjectList from '@/components/projects/project-list.vue'
import ProjectPopover from '@/components/projects/project-popover.vue'

const props = defineProps<{
  collapsed: boolean
}>()

const projectList = ref([
  {
    name: '项目11111111111111111111111111111111',
    children: [
      {
        name: '会话111111111111111111111111111111'
      },
      {
        name: '会话2'
      }
    ]
  },
  {
    name: '项目2',
    children: []
  }
])

const addDialogVisible = ref(false)

/**
 * 新建项目
 */
const handleAddProject = () => {
  addDialogVisible.value = true
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
