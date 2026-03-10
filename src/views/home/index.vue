<template>
  <div class="page-layout">
    <sidebar class="sidebar-layout"></sidebar>
    <main class="main-layout">
      <component :is="currentModuleComponent" />
    </main>
  </div>
</template>
<script setup lang="ts">
import Sidebar from './sidebar/index.vue'
import ProjectHome from '@/components/projects/project-home/index.vue'
import ProjectWorkspace from '@/components/projects/project-workspace/index.vue'
import SessionContainer from '@/components/sessions/session-home/index.vue'

import { useModuleStore } from '@/store'
import { computed } from 'vue'
import { ModuleType } from '@/store/module'

const moduleStore = useModuleStore()

const currentModuleType = computed(() => moduleStore.currentModuleType)

const currentModuleComponent = computed(() => {
  switch (currentModuleType.value) {
    case ModuleType.Project:
      return ProjectHome
    case ModuleType.ProjectSession:
      return ProjectWorkspace
    case ModuleType.Session:
      return SessionContainer
    default:
      return null
  }
})
</script>
<style scoped lang="scss">
.page-layout {
  display: flex;
  width: 100%;
  height: 100%;

  .main-layout {
    flex: 1;
  }
}
</style>
