import { ChatSSEEvent } from './event'
import { ToolCall } from './tool-call'

// 消息角色类型
export enum RoleType {
  User = 'user',
  Assistant = 'assistant'
}
// SSE 事件类型
export interface SSEEvent {
  event: string
  data: any
}

// SSE消息类型
export interface Message {
  id: string
  role: string
  contents: MessageContent[]
}
export interface MessageContent {
  type: ChatSSEEvent
  text?: string // 文本内容
  toolCall?: ToolCall // 工具调用
}
