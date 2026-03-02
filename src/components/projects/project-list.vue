<template>
  <el-tree
    v-if="list.length > 0"
    :data="list"
    :props="TREE_PROPS"
    highlight-current
    :icon="ChevronRight"
    class="project-list"
  >
    <template #default="{ node, data }">
      <project-item :data="data" :type="node.level === 1 ? 'project' : 'conversation'"></project-item>
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

import ProjectItem from './project-item.vue'
import ButtonLink from '@/components/button-link/index.vue'

interface Props {
  list: Array<any>
}

const props = defineProps<Props>()
const emits = defineEmits(['addProject'])

const TREE_PROPS = {
  label: 'name',
  children: 'children',
  isLeaf: 'leaf'
}
</script>
<style scoped lang="scss">
:deep(.el-tree-node__content) {
  height: auto;
}

:deep(.el-tree-node__expand-icon) {
  font-size: 14px;
  color: #1e293b;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;
  font-size: 13px;
  color: #64748b;
  flex-direction: column;
  gap: 8px;
}
</style>
