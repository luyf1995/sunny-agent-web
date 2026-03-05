import { ref, onUnmounted, watch } from 'vue'
import type { Message, ThinkingState, DisplayScenario, SpawnedTask, ToolCall, UploadedFile } from '@/api/chat/types'
import { createThread, streamChat, getThreadHistory, parseSkillCommand, nextId } from '@/api/chat/index'

interface UseChatOptions {
  initialThreadId?: string | null
  onConversationCreated?: () => void
}

export function useChat(options: UseChatOptions = {}) {
  // 响应式状态（替代 React 的 useState）
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const threadId = ref<string | null>(options.initialThreadId ?? null)
  const abortController = ref<AbortController | null>(null)

  // 保存回调的引用（避免依赖更新导致的问题）
  const onConversationCreated = ref(options.onConversationCreated)

  // 监听回调更新
  watch(
    () => options.onConversationCreated,
    newCb => {
      onConversationCreated.value = newCb
    },
    { immediate: true }
  )

  // 发送消息核心逻辑
  const sendMessage = async (
    text: string,
    agent?: string,
    uploadedFiles?: UploadedFile[],
    projectFileIds?: string[],
    projectId?: string
  ) => {
    if (isStreaming.value) return
    if (!text.trim() && (!uploadedFiles || uploadedFiles.length === 0)) return

    // 创建新线程（首次发送）
    let currentThreadId = threadId.value
    const isFirstMessage = !currentThreadId
    if (!currentThreadId) {
      currentThreadId = await createThread()
      threadId.value = currentThreadId
    }

    // 解析指令
    const { skill, message: parsedMessage } = agent ? { skill: null, message: text.trim() } : parseSkillCommand(text)
    const actualMessage = text.trim()

    // 添加用户消息
    const userMsg: Message = {
      id: nextId(),
      role: 'user',
      content: actualMessage,
      files: uploadedFiles?.map(f => ({
        file_id: f.file_id,
        filename: f.filename,
        size: f.size,
        content_type: f.content_type,
        source: 'user',
        download_url: f.download_url
      }))
    }
    messages.value = [...messages.value, userMsg]

    // 创建助手消息占位符
    const assistantId = nextId()
    const thinkingStart: ThinkingState = {
      steps: [],
      isThinking: true,
      startTime: Date.now(),
      durationSeconds: 0
    }
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      toolCalls: [],
      thinking: thinkingStart,
      displayScenario: 'agent' as DisplayScenario,
      spawnedTasks: [],
      todos: []
    }
    messages.value = [...messages.value, assistantMsg]
    isStreaming.value = true

    // 创建中止控制器
    const controller = new AbortController()
    abortController.value = controller

    // 收集文件ID
    const uploadedFileIds = uploadedFiles?.map(f => f.file_id) ?? []

    try {
      // 处理SSE流式响应
      for await (const event of streamChat(
        currentThreadId,
        skill ? parsedMessage : actualMessage,
        controller.signal,
        agent,
        skill ?? undefined,
        uploadedFileIds.length > 0 ? uploadedFileIds : undefined,
        projectFileIds && projectFileIds.length > 0 ? projectFileIds : undefined,
        projectId
      )) {
        switch (event.event) {
          case 'text_delta':
            // 更新助手消息内容
            messages.value = messages.value.map(m =>
              m.id === assistantId ? { ...m, content: m.content + event.data.text } : m
            )
            break

          case 'tool_call_start': {
            const tc: ToolCall = {
              id: event.data.id,
              name: event.data.name,
              args: event.data.args,
              status: 'running'
            }
            messages.value = messages.value.map(m => {
              if (m.id !== assistantId) return m
              const taskId = event.data.task_id
              if (taskId && m.spawnedTasks) {
                return {
                  ...m,
                  spawnedTasks: m.spawnedTasks.map(task =>
                    task.task_id === taskId ? { ...task, toolCalls: [...task.toolCalls, tc] } : task
                  )
                }
              }
              return { ...m, toolCalls: [...(m.toolCalls ?? []), tc] }
            })
            break
          }

          case 'tool_call_result': {
            const resultStatus = event.data.status === 'success' ? 'done' : 'error'
            messages.value = messages.value.map(m => {
              if (m.id !== assistantId) return m
              const taskId = event.data.task_id
              if (taskId && m.spawnedTasks) {
                return {
                  ...m,
                  spawnedTasks: m.spawnedTasks.map(task =>
                    task.task_id === taskId
                      ? {
                          ...task,
                          toolCalls: task.toolCalls.map(tc =>
                            tc.id === event.data.id ? { ...tc, status: resultStatus, output: event.data.output } : tc
                          )
                        }
                      : task
                  )
                }
              }
              return {
                ...m,
                toolCalls: (m.toolCalls ?? []).map(tc =>
                  tc.id === event.data.id ? { ...tc, status: resultStatus, output: event.data.output } : tc
                )
              }
            })
            break
          }

          case 'thinking':
            messages.value = messages.value.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    displayScenario:
                      event.data.type === 'planning' || event.data.type === 'replanning'
                        ? ('planning' as DisplayScenario)
                        : m.displayScenario === 'quick'
                          ? ('agent' as DisplayScenario)
                          : m.displayScenario,
                    thinking: {
                      ...(m.thinking ?? {
                        steps: [],
                        isThinking: true,
                        startTime: Date.now(),
                        durationSeconds: 0
                      }),
                      steps: [
                        ...(m.thinking?.steps ?? []),
                        { content: event.data.content, type: event.data.type, timestamp: Date.now() }
                      ]
                    }
                  }
                : m
            )
            break

          case 'todos_updated': {
            const { todos, task_id } = event.data
            if (task_id) {
              messages.value = messages.value.map(m =>
                m.id === assistantId
                  ? {
                      ...m,
                      spawnedTasks: m.spawnedTasks?.map(task => (task.task_id === task_id ? { ...task, todos } : task))
                    }
                  : m
              )
            } else {
              messages.value = messages.value.map(m =>
                m.id === assistantId
                  ? {
                      ...m,
                      displayScenario: 'planning' as DisplayScenario,
                      todos
                    }
                  : m
              )
            }
            break
          }

          case 'task_spawned': {
            const newTask: SpawnedTask = {
              task_id: event.data.task_id,
              subagent_type: event.data.subagent_type,
              description: event.data.description,
              status: event.data.status || 'pending',
              toolCalls: []
            }
            messages.value = messages.value.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    displayScenario: m.displayScenario === 'planning' ? 'planning' : ('agent' as DisplayScenario),
                    spawnedTasks: [...(m.spawnedTasks ?? []), newTask]
                  }
                : m
            )
            break
          }

          case 'task_started': {
            messages.value = messages.value.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    spawnedTasks: (m.spawnedTasks ?? []).map(task =>
                      task.task_id === event.data.task_id ? { ...task, status: 'running' } : task
                    )
                  }
                : m
            )
            break
          }

          case 'task_completed': {
            messages.value = messages.value.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    spawnedTasks: (m.spawnedTasks ?? []).map(task =>
                      task.task_id === event.data.task_id
                        ? {
                            ...task,
                            status: event.data.status,
                            duration_ms: event.data.duration_ms
                          }
                        : task
                    )
                  }
                : m
            )
            break
          }

          case 'task_output': {
            messages.value = messages.value.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    spawnedTasks: (m.spawnedTasks ?? []).map(task =>
                      task.task_id === event.data.task_id
                        ? {
                            ...task,
                            output: (task.output || '') + event.data.text
                          }
                        : task
                    )
                  }
                : m
            )
            break
          }

          case 'error':
            messages.value = messages.value.map(m =>
              m.id === assistantId ? { ...m, content: m.content + `\n\n**Error:** ${event.data.message}` } : m
            )
            break

          case 'done':
            messages.value = messages.value.map(m => {
              if (m.id !== assistantId) return m
              if (m.thinking?.isThinking) {
                return {
                  ...m,
                  thinking: {
                    ...m.thinking,
                    isThinking: false,
                    durationSeconds: Math.round((Date.now() - m.thinking.startTime) / 1000)
                  }
                }
              }
              return m
            })
            break
        }
      }
    } catch (err: unknown) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        messages.value = messages.value.map(m =>
          m.id === assistantId ? { ...m, content: m.content + `\n\n**Error:** ${errorMsg}` } : m
        )
      }
    } finally {
      isStreaming.value = false
      abortController.value = null
      // 首次发送消息时触发回调
      if (isFirstMessage && onConversationCreated.value) {
        onConversationCreated.value()
      }
    }
  }

  // 取消当前流式请求
  const cancel = () => {
    abortController.value?.abort()
  }

  // 创建新线程
  const newThread = () => {
    messages.value = []
    threadId.value = null
  }

  // 加载指定线程的历史消息
  const loadThread = async (newThreadId: string) => {
    threadId.value = newThreadId
    messages.value = []

    try {
      const history = await getThreadHistory(newThreadId)
      if (history.messages && history.messages.length > 0) {
        const loadedMessages: Message[] = history.messages.map((msg, index) => ({
          id: `history-${index}`,
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
        messages.value = loadedMessages
      }
    } catch (err) {
      console.error('Failed to load thread history:', err)
    }
  }

  // 组件卸载时取消请求
  onUnmounted(() => {
    cancel()
  })

  // 返回响应式状态和方法
  return {
    messages,
    isStreaming,
    threadId,
    sendMessage,
    cancel,
    newThread,
    loadThread
  }
}
