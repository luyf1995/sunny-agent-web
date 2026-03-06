import { useUserStore } from '@/store'
import { loginBySSO } from '@/api/auth'
import type { SSEEvent } from './types'

import useAppConfig from '@/hooks/use-app-config'

const { apiUrl } = useAppConfig()
const userStore = useUserStore()

export const STREAM_CHAT_URL = apiUrl + '/api/chat/stream'

let msgCounter = 0
export function nextId() {
  return `msg-${++msgCounter}`
}

/**
 * 流式对话
 */
export async function* streamChat(threadId: string, message: string, signal: AbortSignal): AsyncGenerator<SSEEvent> {
  const body: Record<string, unknown> = { thread_id: threadId, message }

  const response = await fetch(STREAM_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + userStore.accessToken
    },
    body: JSON.stringify({
      message
    }),
    signal
  })

  if (!response.ok) {
    if (response.status === 401) {
      // 认证失败，清除token并跳转到SSO登录
      userStore.removeToken()
      loginBySSO()
      throw new Error('登录已过期，请重新登录')
    }
    throw new Error(`流式对话请求失败: ${response.status}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let currentEvent = ''

  const abortHandler = () => {
    reader.cancel()
  }
  signal.addEventListener('abort', abortHandler)

  try {
    while (true) {
      if (signal.aborted) break

      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim()
        } else if (line.startsWith('data: ') && currentEvent) {
          try {
            const data = JSON.parse(line.slice(6))
            yield { event: currentEvent, data } as SSEEvent
          } catch {
            console.error('json解析错误:', line.slice(6))
          }
          currentEvent = ''
        }
      }
    }
  } finally {
    signal.removeEventListener('abort', abortHandler)
    reader.releaseLock()
  }
}
