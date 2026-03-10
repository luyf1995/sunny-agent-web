<template>
  <div v-if="list.length > 0" class="project-list">
    <project-item
      v-for="item in list"
      :key="item.id"
      :data="item"
      @deleted="handleDeleted"
      @renamed="handleRenamed"
    ></project-item>
  </div>
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
import { nextTick, ref, watch } from 'vue'

interface Props {
  list: ProjectInfo[]
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'addProject'): void
  (e: 'deleted', id: string): void
  (e: 'renamed', data: ProjectInfo): void
}>()

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
