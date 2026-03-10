import { ProjectInfo, ProjectSessionInfo } from '@/api/project/types'
import { SessionInfo } from '@/api/session/types'
import { defineStore } from 'pinia'

export enum ModuleType {
  Project = 'project',
  Session = 'session',
  ProjectSession = 'project_session'
}

interface ModuleState {
  currentModuleType: ModuleType | null
  // currentModule: any

  currentSession: SessionInfo | null
  currentProject: ProjectInfo | null
  currentProjectSession: ProjectSessionInfo | null
}

const appStore = defineStore('module', {
  persist: true,
  state: (): ModuleState => {
    return {
      currentModuleType: ModuleType.Session,
      // currentModule: null,
      currentSession: null,
      currentProject: null,
      currentProjectSession: null
    }
  },
  actions: {
    setCurrentModuleType(moduleType: ModuleType) {
      this.currentModuleType = moduleType
    },

    setCurrentSession(session: SessionInfo | null) {
      this.currentSession = session
      this.currentProject = null
      this.currentProjectSession = null
    },

    setCurrentProject(project: ProjectInfo | null) {
      this.currentProject = project
      this.currentSession = null
      // this.currentProjectSession = null
    },

    setCurrentProjectSession(projectSession: ProjectSessionInfo | null) {
      this.currentProjectSession = projectSession
      this.currentSession = null
    }
  }
})

export default appStore
