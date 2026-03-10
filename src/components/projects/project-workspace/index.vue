<template>
  <div class="project-workspace">
    <div class="database-panel panel-card">
      <project-database :project-session="currentProjectSession"></project-database>
    </div>
    <div class="chat-panel panel-card">
      <chat-container :session="currentProjectSession"></chat-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ProjectInfo, ProjectSessionInfo } from '@/api/project/types'
import ProjectDatabase from '../project-database/index.vue'
import ChatContainer from '@/components/chat-container/index.vue'

import { useModuleStore } from '@/store'
import { computed } from 'vue'

const moduleStore = useModuleStore()

const currentProjectSession = computed(() => moduleStore.currentProjectSession as ProjectSessionInfo)
</script>
<style scoped lang="scss">
@use './index';
</style>
