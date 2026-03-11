<template>
  <div class="session-home">
    <chat-container :session="currentSession"></chat-container>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import ChatContainer from '@/components/chat-container/index.vue'

import { useModuleStore } from '@/store'
import { SessionInfo } from '@/api/session/types'

const moduleStore = useModuleStore()

const currentSession = computed(() => moduleStore.currentSession as SessionInfo)
</script>
<style scoped lang="scss">
.session-home {
  display: flex;
  height: 100%;
  flex-direction: column;
}
</style>
