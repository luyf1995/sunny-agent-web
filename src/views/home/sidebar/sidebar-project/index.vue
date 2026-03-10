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
        @add-project="handleAddProject"
        @renamed="handleRenamed"
        @deleted="handleDeleted"
      ></project-list>
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

import { getProjectList } from '@/api/project'
import { ProjectInfo } from '@/api/project/types'
import { DialogTypeEnum } from '@/api/common/types'
import { useModuleStore } from '@/store'

const props = defineProps<{
  collapsed: boolean
}>()

const moduleStore = useModuleStore()

const projectList = ref<ProjectInfo[]>([])
const projectListRef = ref()

const fetchProjectList = async () => {
  try {
    const { data } = await getProjectList()
    projectList.value = data?.items ?? []
    // 刷新树节点
    // projectListRef.value.reRender()
  } catch (error) {
    console.error(error)
  }
}
fetchProjectList()

const saveDialogVisible = ref(false)
const saveDialogData = ref()
const saveDialogType = ref(DialogTypeEnum.ADD)

const handleAddProject = () => {
  saveDialogType.value = DialogTypeEnum.ADD
  saveDialogVisible.value = true
}

const handleRenamed = (data: ProjectInfo) => {
  const index = projectList.value.findIndex(item => item.id === data.id)
  if (index !== -1) {
    projectList.value[index] = { ...projectList.value[index], name: data.name }

    // // TODO: 刷新树节点，先这么修改，后续优化
    // const treeData = projectListRef.value.elTreeRef.getNode(data.id)?.data || {}
    // console.log(1111, projectListRef.value.elTreeRef.getNode(data.id))
    // projectListRef.value.elTreeRef.getNode(data.id)?.setData({
    //   ...treeData,
    //   name: data.name,
    //   expanded: false
    // })
  }
  if (moduleStore.currentProject?.id === data.id) {
    // moduleStore.setCurrentProject({ ...moduleStore.currentProject, name: data.name })
  }
}

const handleDeleted = (id: string) => {
  if (moduleStore.currentProject?.id === id) {
    moduleStore.setCurrentProject(null)
  }
  fetchProjectList()
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
