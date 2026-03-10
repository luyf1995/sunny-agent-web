<template>
  <el-tree
    v-if="list.length > 0"
    :data="list"
    :props="TREE_PROPS"
    highlight-current
    :expand-on-click-node="false"
    :icon="ChevronRight"
    class="project-list"
    lazy
    :load="loadNode"
  >
    <template #default="{ node, data }">
      <project-item
        :data="data"
        :type="node.level === 1 ? ModuleType.Project : ModuleType.ProjectSession"
        @deleted="handleDeleted"
        @renamed="handleRenamed"
      ></project-item>
    </template>
  </el-tree>
  <div v-else class="empty">
    <folder-plus :size="24" />
    <span>暂无项目</span>
    <button-link @click="emits('addProject')">创建第一个项目</button-link>
  </div>
</template>
<script setup lang="ts">
import { ChevronRight, FolderPlus } from 'lucide-vue-next'

import ProjectItem from '../project-item/index.vue'
import ButtonLink from '@/components/button-link/index.vue'
import { ProjectInfo, ProjectSessionInfo } from '@/api/project/types'
import { ModuleType } from '@/store/module'
import { getProjectSessions } from '@/api/project'
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'

interface Props {
  list: ProjectInfo[]
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'addProject'): void
  (e: 'deleted', id: string): void
  (e: 'renamed', data: ProjectInfo): void
}>()

const TREE_PROPS = {
  label: 'name',
  children: 'children',
  isLeaf: 'leaf'
}

const loadNode = async (node: any, resolve: (data: TreeNodeData[]) => void) => {
  if (node.level === 0) {
    resolve(props.list.map(item => ({ ...item, leaf: item.session_count === 0 })))
    return
  }

  if (node.level === 1) {
    const projectData = node.data as ProjectInfo
    if (projectData.session_count === 0) {
      resolve([])
      return
    }
    try {
      const { data } = await getProjectSessions(projectData.id)
      const sessionList = (data?.items || []).map((item: ProjectSessionInfo) => ({
        ...item,
        name: item.title,
        leaf: true
      }))
      resolve(sessionList)
    } catch {
      resolve([])
    }
    return
  }

  resolve([])
}

const handleDeleted = (id: string) => {
  emits('deleted', id)
}

const handleRenamed = (data: ProjectInfo) => {
  emits('renamed', data)
}
</script>
<style scoped lang="scss">
@use './index';
</style>
