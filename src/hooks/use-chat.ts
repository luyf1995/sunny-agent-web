import { ref, onUnmounted, watch, computed } from 'vue'
import { Message, MessageRoleType } from '@/api/chat/types'
import { ToolCallName, ToolCallStatus, QuestionItem } from '@/api/chat/tool-call'
import { streamChat, nextId } from '@/api/chat/index'
import { ChatSSEEvent } from '@/api/chat/event'
import { getSessionDetail } from '@/api/session'
import { useSessionCache } from './use-session-cache'

interface UseChatOptions {
  onSessionCreated?: (...args: any[]) => void
}

export function useChat(options: UseChatOptions = {}) {
  const {
    getCache,
    setCache,
    removeCache,
    hasCache,
    addMessage,
    updateMessage,
    isStreaming: isCacheStreaming,
    setStreaming,
    setAbortController,
    setAskUserQuestions
  } = useSessionCache()

  const currentSessionId = ref<string | null>(null)
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const askUserQuestions = ref<QuestionItem[] | null>(null)

  const showAskUser = computed(() => askUserQuestions.value !== null && askUserQuestions.value.length > 0)

  const onSessionCreated = ref(options.onSessionCreated)

  /**
   * 切换会话
   * @param sessionId 会话id
   */
  const switchSession = (sessionId: string | null) => {
    currentSessionId.value = sessionId

    if (!sessionId) {
      messages.value = []
      isStreaming.value = false
      askUserQuestions.value = null
      return
    }

    const cache = getCache(sessionId)
    if (cache) {
      messages.value = [...cache.messages]
      isStreaming.value = cache.isStreaming
      askUserQuestions.value = cache.askUserQuestions
    } else {
      messages.value = []
      isStreaming.value = false
      askUserQuestions.value = null
    }
  }

  /**
   * 检查会话是否有缓存
   * @param {string} sessionId 会话id
   * @returns 是否有缓存
   */
  const hasSessionCache = (sessionId: string): boolean => {
    return hasCache(sessionId)
  }

  /**
   * 发送消息
   * @param {string | null | undefined} sessionId 会话id
   * @param {string} text 消息内容
   */
  const sendMessage = async (sessionId: string | null | undefined, text: string) => {
    if (!text.trim()) return

    const targetSessionId = sessionId || `temp-${Date.now()}`
    const isNewSession = !sessionId

    const userMsg: Message = {
      id: nextId(),
      role: MessageRoleType.User,
      contents: [
        {
          type: ChatSSEEvent.Delta,
          text
        }
      ]
    }

    const assistantId = nextId()
    const assistantMsg: Message = {
      id: assistantId,
      role: MessageRoleType.Assistant,
      contents: []
    }

    if (!hasCache(targetSessionId)) {
      setCache(targetSessionId, {
        messages: [userMsg, assistantMsg],
        isStreaming: true,
        abortController: null,
        askUserQuestions: null
      })
    } else {
      addMessage(targetSessionId, userMsg)
      addMessage(targetSessionId, assistantMsg)
    }

    if (targetSessionId === currentSessionId.value) {
      const cache = getCache(targetSessionId)
      if (cache) {
        messages.value = [...cache.messages]
        isStreaming.value = true
      }
    }

    const controller = new AbortController()
    setAbortController(targetSessionId, controller)

    let sessionCreatedTriggered = false
    let actualSessionId = targetSessionId

    setStreaming(actualSessionId, true)

    try {
      for await (const event of streamChat(sessionId ?? '', text, controller.signal)) {
        switch (event.event) {
          case ChatSSEEvent.Status:
            if (event.data.phase === 'executing' && !sessionCreatedTriggered && isNewSession) {
              sessionCreatedTriggered = true
              actualSessionId = event.data.session_id

              const oldCache = getCache(targetSessionId)
              if (oldCache && targetSessionId !== actualSessionId) {
                setCache(actualSessionId, {
                  messages: oldCache.messages,
                  isStreaming: true,
                  abortController: controller,
                  askUserQuestions: oldCache.askUserQuestions
                })
                setAbortController(targetSessionId, null)
                removeCache(targetSessionId)
              }

              if (onSessionCreated.value) {
                onSessionCreated.value({
                  session_id: event.data.session_id,
                  title: event.data.title
                })
              }
            }
            break

          case ChatSSEEvent.Delta: {
            updateMessage(actualSessionId, assistantId, msg => {
              const lastContent = msg.contents?.slice(-1)[0]
              if (!lastContent || lastContent.type !== ChatSSEEvent.Delta) {
                msg.contents?.push({
                  type: ChatSSEEvent.Delta,
                  text: event.data.content || ''
                })
              } else {
                lastContent.text += event.data.content || ''
              }
            })

            if (actualSessionId === currentSessionId.value) {
              const cache = getCache(actualSessionId)
              if (cache) {
                messages.value = [...cache.messages]
              }
            }
            break
          }

          case ChatSSEEvent.ToolCall: {
            const toolCall = {
              step: event.data.step,
              name: event.data.name,
              args: event.data.args,
              status: ToolCallStatus.Running,
              result: {}
            }
            updateMessage(actualSessionId, assistantId, msg => {
              msg.contents?.push({
                type: ChatSSEEvent.ToolCall,
                toolCall
              })
            })

            if (event.data.name === ToolCallName.AskUser) {
              setAskUserQuestions(actualSessionId, event.data.args?.questions || [])
              if (actualSessionId === currentSessionId.value) {
                askUserQuestions.value = event.data.args?.questions || []
              }
            }

            if (actualSessionId === currentSessionId.value) {
              const cache = getCache(actualSessionId)
              if (cache) {
                messages.value = [...cache.messages]
              }
            }
            break
          }

          case ChatSSEEvent.ToolResult: {
            updateMessage(actualSessionId, assistantId, msg => {
              const toolCallIndex = msg.contents!.findIndex(
                tc => tc.type === ChatSSEEvent.ToolCall && tc.toolCall!.step === event.data.step
              )
              if (toolCallIndex !== -1 && msg.contents![toolCallIndex].toolCall) {
                msg.contents![toolCallIndex].toolCall = {
                  ...msg.contents![toolCallIndex].toolCall,
                  status: event.data.status ?? event.data.result.status,
                  result: event.data.result
                }
              }
            })

            if (actualSessionId === currentSessionId.value) {
              const cache = getCache(actualSessionId)
              if (cache) {
                messages.value = [...cache.messages]
              }
            }
            break
          }

          case ChatSSEEvent.Error: {
            updateMessage(actualSessionId, assistantId, msg => {
              msg.contents?.push({
                type: ChatSSEEvent.Error,
                text: event.data.message
              })
            })

            if (actualSessionId === currentSessionId.value) {
              const cache = getCache(actualSessionId)
              if (cache) {
                messages.value = [...cache.messages]
              }
            }
            break
          }

          case ChatSSEEvent.Done:
            break
        }
      }
    } catch (err: unknown) {
      console.error(err)
    } finally {
      setStreaming(actualSessionId, false)
      setAbortController(actualSessionId, null)

      if (actualSessionId === currentSessionId.value) {
        isStreaming.value = false
      }
    }
  }

  const abort = (sessionId?: string) => {
    const targetId = sessionId || currentSessionId.value
    if (targetId) {
      const cache = getCache(targetId)
      cache?.abortController?.abort()
    }
  }

  const clearAskUser = () => {
    askUserQuestions.value = null
    if (currentSessionId.value) {
      setAskUserQuestions(currentSessionId.value, null)
    }
  }

  const clearMessages = () => {
    messages.value = []
  }

  const getHistoryMessages = async (sessionId: string) => {
    if (!sessionId) return

    if (hasCache(sessionId)) {
      const cache = getCache(sessionId)!
      messages.value = [...cache.messages]
      isStreaming.value = cache.isStreaming
      askUserQuestions.value = cache.askUserQuestions
      return
    }

    clearMessages()
    try {
      const { data } = await getSessionDetail(sessionId)
      const historyMsgs = data.messages || []
      if (historyMsgs.length === 0) return

      const loadedMessages: Message[] = []
      for (let msg of historyMsgs) {
        const historyMsg: Message = {
          id: msg.message_id,
          role: msg.role,
          contents: []
        }
        if (msg.role === MessageRoleType.User) {
          historyMsg.contents = [
            {
              type: ChatSSEEvent.Delta,
              text: msg.content
            }
          ]
        } else {
          const resultContent = msg.content || ''
          if (msg.l3_steps) {
            let lastToolStartIndexInContents = -1
            for (let i = 0, length = msg.l3_steps.length; i < length; i++) {
              const step = msg.l3_steps[i]
              if (step.role === MessageRoleType.Assistant) {
                if (step.content) {
                  historyMsg.contents.push({
                    type: ChatSSEEvent.Delta,
                    text: step.content
                  })
                }
                if (step.tool_args) {
                  historyMsg.contents.push({
                    type: ChatSSEEvent.ToolCall,
                    toolCall: {
                      step: step.step_index,
                      name: Object.keys(step.tool_args)?.[0] as ToolCallName,
                      args: Object.values(step.tool_args)?.[0],
                      status: ToolCallStatus.Success,
                      result: {}
                    }
                  })
                  lastToolStartIndexInContents = historyMsg.contents.length - 1
                }
              } else if (step.role === MessageRoleType.Tool) {
                if (historyMsg.contents[lastToolStartIndexInContents].toolCall) {
                  historyMsg.contents[lastToolStartIndexInContents].toolCall!.status = ToolCallStatus.Success
                  historyMsg.contents[lastToolStartIndexInContents].toolCall!.result = JSON.parse(step.content || '{}')
                }
              }
            }
          }
          historyMsg.contents.push({
            type: ChatSSEEvent.Delta,
            text: resultContent
          })
        }
        loadedMessages.push(historyMsg)
      }

      setCache(sessionId, {
        messages: loadedMessages,
        isStreaming: false,
        abortController: null,
        askUserQuestions: null
      })
      messages.value = loadedMessages
    } catch (e) {
      console.error(e)
    }
  }

  const removeSessionCache = (sessionId: string) => {
    removeCache(sessionId)
  }

  return {
    messages,
    isStreaming,
    currentSessionId,
    sendMessage,
    abort,
    askUserQuestions,
    showAskUser,
    clearAskUser,
    getHistoryMessages,
    clearMessages,
    switchSession,
    removeSessionCache,
    isSessionStreaming: isCacheStreaming,
    hasSessionCache
  }
}
