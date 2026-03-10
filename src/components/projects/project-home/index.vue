<template>
  <div class="project-home">
    <div class="project-home-content">
      <div class="project-home-header">
        <div class="project-home-icon">
          <folder :size="48" />
        </div>
        <h1 class="project-home-title">{{ currentProject?.name }}</h1>
        <p class="project-home-meta">{{ dayjs(currentProject?.updated_at).format('YYYY-MM-DD HH:mm:ss') }} 更新</p>
      </div>
      <div class="project-home-chat">
        <chat-input></chat-input>
      </div>
      <div class="project-home-cards">
        <file-card :project="currentProject"></file-card>
        <skill-card></skill-card>
      </div>
      <div class="project-home-sessions">
        <h2 class="sessions-title">会话</h2>
        <div class="sessions-list">
          <div class="session-item">
            <message-square :size="16" />
            <span class="session-item__title">New Session</span>
            <span class="session-item__time">2小时前</span>
          </div>
          <div class="session-item">
            <message-square :size="16" />
            <span class="session-item__title">New Session</span>
            <span class="session-item__time">5小时前</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Folder, MessageSquare } from 'lucide-vue-next'
import dayjs from 'dayjs'

import ChatInput from './chat-input.vue'
import FileCard from './file-card.vue'
import SkillCard from './skill-card.vue'

import { useModuleStore } from '@/store'
import { computed, ref, watch } from 'vue'
import { ProjectDetail } from '@/api/project/types'
import { getProjectDetail, getProjectSessions } from '@/api/project'

const moduleStore = useModuleStore()

const currentProject = computed<ProjectDetail>(() => moduleStore.currentProject as ProjectDetail)

const projectDetail = ref<ProjectDetail>()
const projectSessions = ref<SessionInfo[]>()

const init = async () => {
  await fetchProjectDetail()
  if (projectDetail.value?.session_count) {
    fetchProjectSessions()
  }
}
const fetchProjectDetail = async () => {
  if (currentProject.value) {
    const { data } = await getProjectDetail(currentProject.value.id)
    projectDetail.value = data
  }
}

const fetchProjectSessions = async () => {
  if (currentProject.value) {
    const { data } = await getProjectSessions(currentProject.value.id)
  }
}

watch(
  currentProject,
  () => {
    if (currentProject.value) {
      init()
    }
  },
  {
    immediate: true
  }
)
</script>
<style scoped lang="scss">
@use './index';
</style>
