import { ref, onUnmounted, watch, computed } from 'vue'
import { Message, MessageRoleType } from '@/api/chat/types'
import { ToolCallName, ToolCallStatus, QuestionItem } from '@/api/chat/tool-call'
import { streamChat, nextId } from '@/api/chat/index'
import { ChatSSEEvent } from '@/api/chat/event'
import { getConversationDetail } from '@/api/conversation'

interface UseChatOptions {
  conversationId?: string | null
  onConversationCreated?: (...args: any[]) => void
}

export function useChat(options: UseChatOptions = {}) {
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const conversationId = ref<string | null>(options.conversationId ?? null)
  const abortController = ref<AbortController | null>(null)
  const askUserQuestions = ref<QuestionItem[] | null>(null)
  const skipNextHistoryLoad = ref(false)

  const showAskUser = computed(() => askUserQuestions.value !== null && askUserQuestions.value.length > 0)

  const onConversationCreated = ref(options.onConversationCreated)

  watch(
    () => options.onConversationCreated,
    newC => {
      onConversationCreated.value = newC
    },
    { immediate: true }
  )

  /**
   * 发送消息
   * @param conversationId 会话id
   * @param text 消息内容
   */
  const sendMessage = async (conversationId: string | null | undefined, text: string) => {
    if (isStreaming.value) return
    if (!text.trim()) return

    const isNewConversation = !conversationId

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
    messages.value.push(userMsg)

    const assistantId = nextId()
    const assistantMsg: Message = {
      id: assistantId,
      role: MessageRoleType.Assistant,
      contents: []
    }
    messages.value.push(assistantMsg)

    isStreaming.value = true

    let conversationCreatedTriggered = false

    const controller = new AbortController()
    abortController.value = controller

    try {
      for await (const event of streamChat(conversationId ?? '', text, controller.signal)) {
        switch (event.event) {
          case ChatSSEEvent.Status:
            if (event.data.phase === 'executing' && !conversationCreatedTriggered && isNewConversation) {
              conversationCreatedTriggered = true
              skipNextHistoryLoad.value = true
              if (onConversationCreated.value) {
                onConversationCreated.value({
                  session_id: event.data.session_id,
                  title: event.data.title
                })
              }
            }
            break

          case ChatSSEEvent.Delta: {
            const index = messages.value.findIndex(m => m.id === assistantId)
            if (index === -1) break

            const lastContent = messages.value[index].contents?.slice(-1)[0]
            if (!lastContent || lastContent.type !== ChatSSEEvent.Delta) {
              messages.value[index].contents?.push({
                type: ChatSSEEvent.Delta,
                text: event.data.content || ''
              })
            } else {
              lastContent.text += event.data.content || ''
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
            const index = messages.value.findIndex(m => m.id === assistantId)
            if (index !== -1) {
              messages.value[index].contents?.push({
                type: ChatSSEEvent.ToolCall,
                toolCall
              })
            }
            if (event.data.name === ToolCallName.AskUser) {
              askUserQuestions.value = event.data.args?.questions || []
            }
            break
          }

          case ChatSSEEvent.ToolResult: {
            const index = messages.value.findIndex(m => m.id === assistantId)
            if (index !== -1) {
              const toolCallIndex = messages.value[index].contents!.findIndex(
                tc => tc.type === ChatSSEEvent.ToolCall && tc.toolCall!.step === event.data.step
              )
              if (toolCallIndex !== -1 && messages.value[index].contents![toolCallIndex].toolCall) {
                messages.value[index].contents![toolCallIndex].toolCall = {
                  ...messages.value[index].contents![toolCallIndex].toolCall,
                  status: event.data.status ?? event.data.result.status,
                  result: event.data.result
                }
              }
            }
            break
          }

          case ChatSSEEvent.Error: {
            const index = messages.value.findIndex(m => m.id === assistantId)
            if (index !== -1) {
              messages.value[index].contents?.push({
                type: ChatSSEEvent.Error,
                text: event.data.message
              })
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
      isStreaming.value = false
      abortController.value = null
    }
  }

  const abort = () => {
    abortController.value?.abort()
  }

  const clearAskUser = () => {
    askUserQuestions.value = null
  }

  const clearMessages = () => {
    messages.value = []
  }

  /**
   * 获取对话消息历史
   * @param {string} conversationId 会话id
   */
  const getHistoryMessages = async (conversationId: string) => {
    if (skipNextHistoryLoad.value) {
      skipNextHistoryLoad.value = false
      return
    }

    clearMessages()
    try {
      if (!conversationId) return []
      const { data } = await getConversationDetail(conversationId)
      const historyMsgs = data.messages || []
      if (historyMsgs.length === 0) return
      for (let msg of historyMsgs) {
        const historyMsgs: Message = {
          id: msg.message_id,
          role: msg.role,
          contents: []
        }
        if (msg.role === MessageRoleType.User) {
          historyMsgs.contents = [
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
                  historyMsgs.contents.push({
                    type: ChatSSEEvent.Delta,
                    text: step.content
                  })
                }
                if (step.tool_args) {
                  historyMsgs.contents.push({
                    type: ChatSSEEvent.ToolCall,
                    toolCall: {
                      step: step.step_index,
                      name: Object.keys(step.tool_args)?.[0] as ToolCallName,
                      args: Object.values(step.tool_args)?.[0],
                      status: ToolCallStatus.Success,
                      result: {}
                    }
                  })
                  lastToolStartIndexInContents = historyMsgs.contents.length - 1
                }
              } else if (step.role === MessageRoleType.Tool) {
                if (historyMsgs.contents[lastToolStartIndexInContents].toolCall) {
                  historyMsgs.contents[lastToolStartIndexInContents].toolCall!.status = ToolCallStatus.Success
                  historyMsgs.contents[lastToolStartIndexInContents].toolCall!.result = JSON.parse(step.content || '{}')
                }
              }
            }
          }
          historyMsgs.contents.push({
            type: ChatSSEEvent.Delta,
            text: resultContent
          })
        }

        messages.value.push(historyMsgs)
      }
    } catch (e) {
      console.error(e)
    }
  }

  onUnmounted(() => {
    abort()
  })

  return {
    messages,
    isStreaming,
    conversationId,
    sendMessage,
    abort,
    askUserQuestions,
    showAskUser,
    clearAskUser,
    getHistoryMessages,
    clearMessages
  }
}
