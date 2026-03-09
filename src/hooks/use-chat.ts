import { ref, onUnmounted, watch, computed } from 'vue'
import { Message, RoleType } from '@/api/chat/types'
import { ToolCallName, ToolCallStatus, QuestionItem } from '@/api/chat/tool-call'
import { streamChat, nextId } from '@/api/chat/index'
import { ChatSSEEvent } from '@/api/chat/event'

interface UseChatOptions {
  initialThreadId?: string | null
  onConversationCreated?: () => void
}

export function useChat(options: UseChatOptions = {}) {
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const threadId = ref<string | null>(options.initialThreadId ?? null)
  const abortController = ref<AbortController | null>(null)
  const askUserQuestions = ref<QuestionItem[] | null>(null)

  const showAskUser = computed(() => askUserQuestions.value !== null && askUserQuestions.value.length > 0)

  const onConversationCreated = ref(options.onConversationCreated)

  watch(
    () => options.onConversationCreated,
    newCb => {
      onConversationCreated.value = newCb
    },
    { immediate: true }
  )

  const sendMessage = async (text: string) => {
    if (isStreaming.value) return
    if (!text.trim()) return

    // 用户消息
    const userMsg: Message = {
      id: nextId(),
      role: RoleType.User,
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
      role: RoleType.Assistant,
      contents: []
    }
    messages.value.push(assistantMsg)

    isStreaming.value = true

    // 创建中止控制器
    const controller = new AbortController()
    abortController.value = controller

    try {
      // 处理SSE流式响应
      for await (const event of streamChat('', text, controller.signal)) {
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

  // 取消当前流式请求
  const abort = () => {
    abortController.value?.abort()
  }

  // 清除 ask-user 问题
  const clearAskUser = () => {
    askUserQuestions.value = null
  }

  // 组件卸载时取消请求
  onUnmounted(() => {
    abort()
  })

  // 返回响应式状态和方法
  return {
    messages,
    isStreaming,
    threadId,
    sendMessage,
    abort,
    askUserQuestions,
    showAskUser,
    clearAskUser
  }
}
