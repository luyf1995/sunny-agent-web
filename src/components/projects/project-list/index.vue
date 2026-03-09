<template>
  <el-tree
    v-if="list.length > 0"
    :data="list"
    :props="TREE_PROPS"
    highlight-current
    :expand-on-click-node="false"
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

import ProjectItem from '../project-item/index.vue'
import ButtonLink from '@/components/button-link/index.vue'
import { ProjectInfo } from '@/api/project/types'
import { watch } from 'vue'

interface Props {
  list: ProjectInfo[]
}

const props = defineProps<Props>()
const emits = defineEmits(['addProject'])

const TREE_PROPS = {
  label: 'name',
  children: 'children',
  isLeaf: 'leaf'
}

watch(
  () => props.list,
  newVal => {
    console.log(newVal)
  }
)
</script>
<style scoped lang="scss">
@use './index';
</style>
