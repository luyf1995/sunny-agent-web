import { defineStore } from 'pinia'

export enum ModuleType {
  Project = 'project', // 项目
  Conversation = 'conversation', // 独立对话
  ProjectConversation = 'project_conversation' // 项目中的对话
}

interface ModuleState {
  currentModuleType: ModuleType | null
  currentModule: any
}

const appStore = defineStore('module', {
  persist: true,
  state: (): ModuleState => {
    return {
      currentModuleType: null,
      currentModule: null
    }
  },
  actions: {
    setCurrentModule(moduleType: ModuleType, module: any) {
      this.currentModuleType = moduleType
      this.currentModule = module
    }
  }
})

export default appStore
