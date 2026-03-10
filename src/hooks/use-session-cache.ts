import { ref, reactive } from 'vue'
import { Message } from '@/api/chat/types'
import { QuestionItem } from '@/api/chat/tool-call'

export interface SessionCache {
  sessionId: string
  messages: Message[]
  isStreaming: boolean
  abortController: AbortController | null
  askUserQuestions: QuestionItem[] | null
}

const cacheMap = reactive(new Map<string, SessionCache>())

/**
 * 会话缓存
 */
export function useSessionCache() {
  const getCache = (sessionId: string): SessionCache | undefined => {
    return cacheMap.get(sessionId)
  }

  /**
   * 设置会话缓存
   * @param {string} sessionId 会话id
   * @param {Partial<SessionCache>} cache 会话缓存
   */
  const setCache = (sessionId: string, cache: Partial<SessionCache>): void => {
    const existing = cacheMap.get(sessionId)
    if (existing) {
      Object.assign(existing, cache)
    } else {
      cacheMap.set(sessionId, {
        sessionId,
        messages: cache.messages || [],
        isStreaming: cache.isStreaming || false,
        abortController: cache.abortController || null,
        askUserQuestions: cache.askUserQuestions || null,
        ...cache
      })
    }
  }

  /**
   * 删除会话缓存
   * @param {string} sessionId 会话id
   */
  const removeCache = (sessionId: string): void => {
    const cache = cacheMap.get(sessionId)
    if (cache?.abortController) {
      cache.abortController.abort()
    }
    cacheMap.delete(sessionId)
  }

  /**
   * 检查会话缓存是否存在
   * @param {string} sessionId 会话id
   * @returns {boolean} 是否存在
   */
  const hasCache = (sessionId: string): boolean => {
    return cacheMap.has(sessionId)
  }

  /**
   * 清除所有会话缓存
   */
  const clearAllCache = (): void => {
    cacheMap.forEach(cache => {
      cache.abortController?.abort()
    })
    cacheMap.clear()
  }

  /**
   * 检查会话是否正在流式传输
   * @param {string} sessionId 会话id
   * @returns {boolean} 是否正在流式传输
   */
  const isStreaming = (sessionId: string): boolean => {
    return cacheMap.get(sessionId)?.isStreaming || false
  }

  /**
   * 设置会话是否正在流式传输
   * @param {string} sessionId 会话id
   * @param {boolean} streaming 是否正在流式传输
   */
  const setStreaming = (sessionId: string, streaming: boolean): void => {
    setCache(sessionId, { isStreaming: streaming })
  }

  /**
   * 获取会话消息
   * @param {string} sessionId 会话id
   * @returns {Message[]} 消息列表
   */
  const getMessages = (sessionId: string): Message[] => {
    return cacheMap.get(sessionId)?.messages || []
  }

  /**
   * 设置会话消息
   * @param {string} sessionId 会话id
   * @param {Message[]} messages 消息列表
   */
  const setMessages = (sessionId: string, messages: Message[]): void => {
    setCache(sessionId, { messages })
  }

  /**
   * 添加会话消息
   * @param {string} sessionId 会话id
   * @param {Message} message 消息
   */
  const addMessage = (sessionId: string, message: Message): void => {
    const cache = cacheMap.get(sessionId)
    if (cache) {
      cache.messages.push(message)
    } else {
      setCache(sessionId, { messages: [message] })
    }
  }

  /**
   * 更新会话消息
   * @param {string} sessionId 会话id
   * @param {string} messageId 消息id
   * @param {function} updater 更新函数
   */
  const updateMessage = (sessionId: string, messageId: string, updater: (msg: Message) => void): void => {
    const cache = cacheMap.get(sessionId)
    if (cache) {
      const msg = cache.messages.find(m => m.id === messageId)
      if (msg) {
        updater(msg)
      }
    }
  }

  /**
   * 设置会话取消控制器
   * @param {string} sessionId 会话id
   * @param {AbortController | null} controller 取消控制器
   */
  const setAbortController = (sessionId: string, controller: AbortController | null): void => {
    setCache(sessionId, { abortController: controller })
  }

  /**
   * 设置会话需要用户确认的问题
   * @param {string} sessionId 会话id
   * @param {QuestionItem[] | null} questions 问题列表
   */
  const setAskUserQuestions = (sessionId: string, questions: QuestionItem[] | null): void => {
    setCache(sessionId, { askUserQuestions: questions })
  }

  return {
    cacheMap,
    getCache,
    setCache,
    removeCache,
    hasCache,
    clearAllCache,
    isStreaming,
    getMessages,
    setMessages,
    addMessage,
    updateMessage,
    setStreaming,
    setAbortController,
    setAskUserQuestions
  }
}
