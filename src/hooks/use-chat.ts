import { ref, onUnmounted, watch, computed } from 'vue'
import { Message, MessageRoleType } from '@/api/chat/types'
import { ToolCallName, ToolCallStatus, QuestionItem } from '@/api/chat/tool-call'
import { streamChat, nextId } from '@/api/chat/index'
import { ChatSSEEvent } from '@/api/chat/event'
import { getConversationDetail } from '@/api/conversation'

interface UseChatOptions {
  conversationId?: string | null
  onConversationCreated?: () => void
}

export function useChat(options: UseChatOptions = {}) {
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const conversationId = ref<string | null>(options.conversationId ?? null)
  const abortController = ref<AbortController | null>(null)
  const askUserQuestions = ref<QuestionItem[] | null>(null)

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

    // 用户消息
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

    // AI消息占位符
    const assistantId = nextId()
    const assistantMsg: Message = {
      id: assistantId,
      role: MessageRoleType.Assistant,
      contents: []
    }
    messages.value.push(assistantMsg)

    isStreaming.value = true

    // 创建中止控制器
    const controller = new AbortController()
    abortController.value = controller

    try {
      // 处理SSE流式响应
      for await (const event of streamChat(conversationId ?? '', text, controller.signal)) {
        switch (event.event) {
          case ChatSSEEvent.Delta:
            const index = messages.value.findIndex(m => m.id === assistantId)

            const lastContent = messages.value[index].contents?.slice(-1)[0]
            if (!lastContent || lastContent.type !== ChatSSEEvent.Delta) {
              messages.value[index].contents?.push({
                type: ChatSSEEvent.Delta,
                text: ''
              })
            } else {
              lastContent.text += event.data.content
            }
            break
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
          case 'done':
            break
        }
      }
    } catch (err: unknown) {
    } finally {
      isStreaming.value = false
      abortController.value = null
    }
  }

  /**
   * 取消当前流式请求
   */
  const abort = () => {
    abortController.value?.abort()
  }

  /**
   * 清除 ask-user 问题
   */
  const clearAskUser = () => {
    askUserQuestions.value = null
  }
  /**
   * 清空消息
   */
  const clearMessages = () => {
    messages.value = []
  }

  /**
   * 获取对话消息历史
   * @param {string} conversationId 会话id
   */
  const getHistoryMessages = async (conversationId: string) => {
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
          // 用户消息
          historyMsgs.contents = [
            {
              type: ChatSSEEvent.Delta,
              text: msg.content
            }
          ]
        } else {
          // 助手消息
          const resultContent = msg.content || ''
          let lastToolStartIndexInContents = -1
          for (let i = 0, length = msg.l3_steps.length; i < length; i++) {
            const step = msg.l3_steps[i]
            if (step.role === MessageRoleType.Assistant) {
              // 工具开始调用
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
              // 工具调用结果
              if (historyMsgs.contents[lastToolStartIndexInContents].toolCall) {
                console.log('工具调用结果', step.content)
                historyMsgs.contents[lastToolStartIndexInContents].toolCall!.status = ToolCallStatus.Success
                historyMsgs.contents[lastToolStartIndexInContents].toolCall!.result = JSON.parse(step.content || '{}')
              }
            }
          }
          historyMsgs.contents.push({
            type: ChatSSEEvent.Delta,
            text: resultContent
          })
        }

        messages.value.push(historyMsgs)
        console.log(111, messages.value)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 组件卸载时取消请求
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
