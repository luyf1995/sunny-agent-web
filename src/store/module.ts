import { ConversationDetail, ConversationInfo } from '@/api/conversation/types'
import { defineStore } from 'pinia'

export enum ModuleType {
  Project = 'project', // 项目
  Conversation = 'conversation', // 独立对话
  ProjectConversation = 'project_conversation' // 项目中的对话
}

interface ModuleState {
  currentModuleType: ModuleType | null
  currentModule: any

  currentConversation: ConversationInfo | null
}

const appStore = defineStore('module', {
  persist: true,
  state: (): ModuleState => {
    return {
      currentModuleType: ModuleType.Conversation,
      currentModule: null,
      // 当前会话
      currentConversation: null
    }
  },
  actions: {
    setCurrentModuleType(moduleType: ModuleType) {
      this.currentModuleType = moduleType
    },

    /**
     * 设置当前会话
     * @param conversation 会话信息
     */
    setCurrentConversation(conversation: ConversationInfo | null) {
      this.currentConversation = conversation
    }
  }
})

export default appStore
