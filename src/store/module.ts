import { SessionDetail, SessionInfo } from '@/api/session/types'
import { defineStore } from 'pinia'

export enum ModuleType {
  Project = 'project',
  Session = 'session',
  ProjectSession = 'project_session'
}

interface ModuleState {
  currentModuleType: ModuleType | null
  currentModule: any

  currentSession: SessionInfo | null
}

const appStore = defineStore('module', {
  persist: true,
  state: (): ModuleState => {
    return {
      currentModuleType: ModuleType.Session,
      currentModule: null,
      currentSession: null
    }
  },
  actions: {
    setCurrentModuleType(moduleType: ModuleType) {
      this.currentModuleType = moduleType
    },

    setCurrentSession(session: SessionInfo | null) {
      this.currentSession = session
    }
  }
})

export default appStore
