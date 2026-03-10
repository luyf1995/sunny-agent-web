<template>
  <div class="chat-input">
    <textarea
      v-model="message"
      class="chat-input__textarea"
      placeholder="输入问题开始新的对话"
      rows="3"
      @keyup.enter="handleSendMessage"
    />
    <div class="chat-input__actions">
      <!-- <button-icon class="action-btn upload-btn">
        <plus />
      </button-icon> -->
      <div></div>
      <el-button type="primary" class="action-btn submit-btn" :disabled="!message.trim()" @click="handleSendMessage">
        <arrow-up />
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Plus, ArrowUp } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'

import { ProjectDetail } from '@/api/project/types'
import { useChat } from '@/hooks/use-chat'
import { moveSessionToProject } from '@/api/project/index'
import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'

interface Props {
  project: ProjectDetail
}

const props = defineProps<Props>()

const moduleStore = useModuleStore()

const { sendMessage } = useChat({
  onSessionCreated: session => {
    moveSessionToProject(props.project.id, session.session_id)
    moduleStore.setCurrentModuleType(ModuleType.ProjectSession)
    moduleStore.setCurrentProjectSession(session)
    console.log('session', session)
    // eventBus.emit(EVENT_NAMES.SESSION_UNSHIFT, session)
  }
})

const message = ref('')

const handleSendMessage = () => {
  if (!message.value.trim()) return
  sendMessage(null, message.value)
  message.value = ''
}
</script>
<style scoped lang="scss">
.chat-input {
  padding: 16px;
  border: var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);

  &__textarea {
    width: 100%;
    min-height: 60px;
    font-size: 14px;
    font-family: inherit;
    color: #1e293b;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;

    .action-btn {
      padding: 0;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .upload-btn {
      background-color: #f1f5f9;
    }
  }
}
</style>
