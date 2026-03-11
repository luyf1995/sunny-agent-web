import {
  deleteProject,
  createProject,
  editProject,
  getProjectList,
  getProjectSessions,
  removeSessionFromProject
} from '@/api/project'
import { SaveProjectParams, ProjectInfo, ProjectSessionInfo } from '@/api/project/types'
import { deleteSession, editSession } from '@/api/session'
import { EditSessionParams } from '@/api/session/types'
import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import eventBus, { EVENT_NAMES } from '@/utils/event-bus'
import { ref } from 'vue'

export default () => {
  const moduleStore = useModuleStore()

  const projectList = ref<ProjectInfo[]>([])

  const selectedProject = ref<ProjectInfo | null>(null)

  /**
   * 选择项目
   * @param {ProjectInfo} project 项目
   */
  const selectProject = (project: ProjectInfo) => {
    setSelectedProject(project)
    moduleStore.setCurrentModuleType(ModuleType.Project)
  }
  /**
   * 设置选中项目
   * @param {ProjectInfo | null} project 项目
   */
  const setSelectedProject = (project: ProjectInfo | null) => {
    selectedProject.value = project
    moduleStore.setCurrentProject(project ?? null)
  }

  /**
   * 刷新项目列表
   */
  const refreshProjectList = async () => {
    try {
      const { data } = await getProjectList()
      projectList.value = data?.items ?? []
    } catch (error) {
      console.error('刷新项目列表失败', error)
    }
  }

  /**
   * 创建项目
   * @param {SaveProjectParams} params 创建项目参数
   */
  const doCreateProject = async (params: SaveProjectParams) => {
    try {
      const { data } = await createProject(params)
      projectList.value.unshift(data ?? {})
      setSelectedProject(data ?? null)
      moduleStore.setCurrentModuleType(ModuleType.Project)
    } catch (error) {
      console.error('创建项目失败', error)
    }
  }

  /**
   * 编辑项目
   * @param {string} projectId 项目id
   * @param {SaveProjectParams} params 编辑项目参数
   */
  const doEditProject = async (projectId: string, params: SaveProjectParams) => {
    try {
      const { data } = await editProject(projectId, params)
      const index = projectList.value.findIndex(item => item.id === projectId)
      if (index !== -1) {
        projectList.value[index] = data ?? {}
      }
      if (selectedProject.value?.id === projectId) {
        setSelectedProject(data ?? null)
      }
    } catch (error) {
      console.error('编辑项目失败', error)
    }
  }

  /**
   * 删除项目
   * @param {string} projectId 项目id
   */
  const doDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      projectList.value = projectList.value.filter(item => item.id !== projectId)
      if (selectedProject.value?.id === projectId) {
        setSelectedProject(null)
        moduleStore.setCurrentModuleType(null)
      }
    } catch (error) {
      console.error('删除项目失败', error)
    }
  }

  /** * 项目会话 ***/
  const projectSessionsMap = ref<Map<string, ProjectSessionInfo[]>>(new Map())
  const selectedProjectSession = ref<ProjectSessionInfo | null>(null)

  /**
   * 获取项目会话
   * @param {string} projectId 项目id
   */
  const getProjectSessionsFromMap = (projectId: string) => {
    return projectSessionsMap.value.get(projectId) ?? []
  }

  /**
   * 选择项目会话
   * @param {ProjectSessionInfo} projectSession 项目会话
   */
  const selectProjectSession = (projectSession: ProjectSessionInfo) => {
    setSelectedProjectSession(projectSession)
    moduleStore.setCurrentModuleType(ModuleType.ProjectSession)
  }
  /**
   * 设置选中项目会话
   * @param {ProjectSessionInfo | null} projectSession 项目会话
   */
  const setSelectedProjectSession = (projectSession: ProjectSessionInfo | null) => {
    selectedProjectSession.value = projectSession
    moduleStore.setCurrentProjectSession(projectSession ?? null)
  }
  /**
   * 获取项目会话
   * @param {string} projectId 项目id
   */
  const fetchProjectSessions = async (projectId: string) => {
    try {
      const { data } = await getProjectSessions(projectId)
      projectSessionsMap.value.set(projectId, data?.items ?? [])

      const index = projectList.value.findIndex(item => item.id === projectId)
      if (index !== -1) {
        projectList.value[index].session_count = data?.items?.length ?? 0
      }
    } catch (error) {
      console.error('获取项目会话失败', error)
    }
  }

  /**
   * 编辑项目会话
   * @param {string} projectId 项目id
   * @param {string} projectSessionId 项目会话id
   * @param {EditSessionParams} params 编辑会话参数
   *
   */
  const doEditProjectSession = async (projectId: string, projectSessionId: string, params: EditSessionParams) => {
    try {
      const { data } = await editSession(projectSessionId, params)

      // const sessions = getProjectSessionsFromMap(projectId ?? '')

      // const index = sessions.findIndex(item => item.session_id === projectSessionId)

      // if (index !== -1) {
      //   sessions[index] = data
      //   projectSessionsMap.value.set(projectId, sessions)
      // }

      fetchProjectSessions(projectId)
      if (selectedProjectSession.value?.session_id === projectSessionId) {
        setSelectedProjectSession({
          ...selectedProjectSession.value,
          ...data
        })
      }
    } catch (error) {
      console.error('编辑项目会话失败', error)
    }
  }
  /**
   * 删除项目会话
   * @param {string} projectId 项目id
   * @param {string} sessionId 会话id
   */
  const doDeleteProjectSession = async (projectId: string, sessionId: string) => {
    try {
      await deleteSession(sessionId)

      fetchProjectSessions(projectId)
      // let sessions = getProjectSessionsFromMap(projectId ?? '')
      // sessions = sessions.filter(item => item.session_id !== sessionId)
      // projectSessionsMap.value.set(projectId, sessions)
      if (selectedProjectSession.value?.session_id === sessionId) {
        setSelectedProjectSession(null)
        moduleStore.setCurrentModuleType(null)
      }
    } catch (error) {
      console.error('删除项目会话失败', error)
    }
  }
  /**
   * 从项目中移除会话
   * @param {string} projectId 项目id
   * @param {string} sessionId 会话id
   */
  const doRemoveSessionFromProject = async (projectId: string, sessionId: string) => {
    try {
      const { data } = await removeSessionFromProject(projectId, sessionId)
      const sessions = getProjectSessionsFromMap(projectId)

      fetchProjectSessions(projectId)

      // projectSessionsMap.value.set(
      //   projectId,
      //   sessions.filter(item => item.session_id !== sessionId)
      // )

      if (selectedProjectSession.value?.session_id === sessionId) {
        setSelectedProjectSession(null)
        moduleStore.setCurrentModuleType(null)
      }
      eventBus.emit(EVENT_NAMES.PROJECT_SESSION_MOVED, data)
    } catch (error) {
      console.error('从项目中移除会话失败', error)
    }
  }

  return {
    projectList,
    selectedProject,
    refreshProjectList,
    doCreateProject,
    doEditProject,
    doDeleteProject,
    selectProject,
    setSelectedProject,
    projectSessionsMap,
    selectedProjectSession,
    fetchProjectSessions,
    getProjectSessionsFromMap,
    selectProjectSession,
    setSelectedProjectSession,
    doEditProjectSession,
    doDeleteProjectSession,
    doRemoveSessionFromProject
  }
}
