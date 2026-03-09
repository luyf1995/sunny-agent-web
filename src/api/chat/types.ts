import { PageQuery } from '../common/types'
import { ChatSSEEvent } from './event'
import { ToolCall } from './tool-call'

// 消息角色类型
export enum MessageRoleType {
  User = 'user', // 用户
  Assistant = 'assistant', // 助手
  Tool = 'tool' // 工具
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
