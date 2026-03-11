import { DialogTypeEnum } from '@/api/common/types'
import { deleteSession, editSession, getSessionList } from '@/api/session'
import { EditSessionParams, SessionInfo } from '@/api/session/types'
import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import { ref } from 'vue'

export default () => {
  const moduleStore = useModuleStore()

  const sessionList = ref<SessionInfo[]>([])

  const selectedSession = ref<SessionInfo | null>(null)
  /**
   * 选择会话
   * @param {SessionInfo} session 会话
   */
  const selectSession = (session: SessionInfo) => {
    setSelectedSession(session)
    moduleStore.setCurrentModuleType(ModuleType.Session)
  }
  /**
   * 设置选中会话
   * @param {SessionInfo | null} session 会话
   */
  const setSelectedSession = (session: SessionInfo | null) => {
    selectedSession.value = session
    moduleStore.setCurrentSession(session ?? null)
  }

  /**
   * 刷新会话列表
   */
  const refreshSessionList = async () => {
    try {
      const { data } = await getSessionList()
      sessionList.value = data?.items ?? []
    } catch (error) {
      console.error('刷新会话列表失败', error)
    }
  }

  /**
   * 编辑会话
   * @param {string} sessionId 会话id
   * @param {EditSessionParams} params 编辑会话参数
   */
  const doEditSession = async (sessionId: string, params: EditSessionParams) => {
    try {
      const { data } = await editSession(sessionId, params)
      const index = sessionList.value.findIndex(item => item.session_id === sessionId)
      if (index !== -1) {
        sessionList.value[index] = data ?? {}
      }
      if (selectedSession.value?.session_id === sessionId) {
        setSelectedSession(data ?? null)
      }
    } catch (error) {
      console.error('编辑会话失败', error)
    }
  }

  /**
   * 删除会话
   * @param {string} sessionId 会话id
   */
  const doDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId)
      sessionList.value = sessionList.value.filter(item => item.session_id !== sessionId)
      if (selectedSession.value?.session_id === sessionId) {
        setSelectedSession(null)
      }
    } catch (error) {
      console.error('删除会话失败', error)
    }
  }

  return {
    sessionList,
    selectedSession,
    refreshSessionList,
    doEditSession,
    doDeleteSession,
    selectSession,
    setSelectedSession
  }
}
