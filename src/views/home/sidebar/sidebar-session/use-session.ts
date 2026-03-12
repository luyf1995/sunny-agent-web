import { getNotifyList, readNotify } from '@/api/notify'
import { NotifyInfo } from '@/api/notify/types'
import { deleteSession, editSession, getSessionList } from '@/api/session'
import { EditSessionParams, SessionInfo, SessionSource } from '@/api/session/types'
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

    if (session.source === SessionSource.Cron && session.unread) {
      readNotifyBySessionId(session.session_id)
    }
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
      const [notifyRes, sessionRes] = await Promise.all([fetchNotifyList(), getSessionList()])
      sessionList.value = sessionRes?.data?.items ?? []

      buildUnreadTag()
    } catch (error) {
      console.error('刷新会话列表失败', error)
    }
  }

  const buildUnreadTag = () => {
    const unreadIds: string[] = []
    unreadNotifyList.value.forEach(item => {
      if (!item.is_read) {
        unreadIds.push(item.session_id)
      }
    })

    sessionList.value.forEach(item => {
      item.unread = unreadIds.includes(item.session_id)
    })
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
        sessionList.value[index] = {
          ...sessionList.value[index],
          ...data
        }
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

  const unreadNotifyList = ref<NotifyInfo[]>([])

  /**
   * 获取消息列表
   */
  const fetchNotifyList = async () => {
    try {
      const { data } = await getNotifyList()
      unreadNotifyList.value = (data?.items || []).filter(item => item.is_read === false)
    } catch (error) {
      console.error('获取消息列表失败', error)
    }
  }

  /**
   * 读取消息
   * @param {string} sessionId 会话ID
   */
  const readNotifyBySessionId = async (sessionId: string) => {
    try {
      const index = unreadNotifyList.value.findIndex(item => item.session_id === sessionId)
      if (index === -1) {
        return
      }
      const notify = unreadNotifyList.value[index]
      await readNotify(notify.id)
      unreadNotifyList.value.splice(index, 1)
      buildUnreadTag()
    } catch (error) {
      console.error('读取消息失败', error)
    }
  }

  return {
    sessionList,
    selectedSession,
    refreshSessionList,
    doEditSession,
    doDeleteSession,
    selectSession,
    setSelectedSession,
    fetchNotifyList,
    readNotifyBySessionId
  }
}
