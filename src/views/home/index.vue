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
import ChatContainer from '@/components/chat-container/index.vue'

import { useModuleStore } from '@/store'
import { computed } from 'vue'
import { ModuleType } from '@/store/module'

const moduleStore = useModuleStore()

const currentModule = computed(() => moduleStore.currentModule)
const currentModuleType = computed(() => moduleStore.currentModuleType)

const currentModuleComponent = computed(() => {
  switch (currentModuleType.value) {
    case ModuleType.Project:
      return ProjectHome
    case ModuleType.ProjectConversation:
      return ProjectWorkspace
    case ModuleType.Conversation:
      return ChatContainer
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
