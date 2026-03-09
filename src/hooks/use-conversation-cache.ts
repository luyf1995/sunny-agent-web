import { ref, reactive } from 'vue'
import { Message } from '@/api/chat/types'
import { QuestionItem } from '@/api/chat/tool-call'

export interface ConversationCache {
  sessionId: string
  messages: Message[]
  isStreaming: boolean
  abortController: AbortController | null
  askUserQuestions: QuestionItem[] | null
}

const cacheMap = reactive(new Map<string, ConversationCache>())

export function useConversationCache() {
  const getCache = (sessionId: string): ConversationCache | undefined => {
    return cacheMap.get(sessionId)
  }

  const setCache = (sessionId: string, cache: Partial<ConversationCache>): void => {
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

  const removeCache = (sessionId: string): void => {
    const cache = cacheMap.get(sessionId)
    if (cache?.abortController) {
      cache.abortController.abort()
    }
    cacheMap.delete(sessionId)
  }

  const hasCache = (sessionId: string): boolean => {
    return cacheMap.has(sessionId)
  }

  const clearAllCache = (): void => {
    cacheMap.forEach(cache => {
      cache.abortController?.abort()
    })
    cacheMap.clear()
  }

  const isStreaming = (sessionId: string): boolean => {
    return cacheMap.get(sessionId)?.isStreaming || false
  }

  const getMessages = (sessionId: string): Message[] => {
    return cacheMap.get(sessionId)?.messages || []
  }

  const setMessages = (sessionId: string, messages: Message[]): void => {
    setCache(sessionId, { messages })
  }

  const addMessage = (sessionId: string, message: Message): void => {
    const cache = cacheMap.get(sessionId)
    if (cache) {
      cache.messages.push(message)
    } else {
      setCache(sessionId, { messages: [message] })
    }
  }

  const updateMessage = (sessionId: string, messageId: string, updater: (msg: Message) => void): void => {
    const cache = cacheMap.get(sessionId)
    if (cache) {
      const msg = cache.messages.find(m => m.id === messageId)
      if (msg) {
        updater(msg)
      }
    }
  }

  const setStreaming = (sessionId: string, streaming: boolean): void => {
    setCache(sessionId, { isStreaming: streaming })
  }

  const setAbortController = (sessionId: string, controller: AbortController | null): void => {
    setCache(sessionId, { abortController: controller })
  }

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
