import { ToolCallArgs, ToolCallName } from '../chat/tool-call'
import { MessageRoleType } from '../chat/types'
import { PageQuery } from '../common/types'

// 会话查询参数
export interface ConversationPageParams extends PageQuery {
  status?: string
}

export enum ConversationStatus {
  Active = 'active',
  Arvhived = 'arvhived',
  All = 'all'
}

// 会话信息
export interface ConversationInfo {
  session_id: string // 会话ID
  title: string // 会话标题
  turn_count: number
  status: ConversationStatus
  create_at: string
  last_active_at: string
}

export interface ConversationDetail {
  session_id: string // 会话ID
  title: string // 会话标题
  has_more: boolean
  messages: ConversationMessage[]
}
export interface ConversationMessage {
  message_id: string // 消息ID
  role: MessageRoleType
  content: string
  l3_steps: L3Step[]
}

export interface L3Step {
  role: MessageRoleType // 角色
  content: string // 内容
  step_index: number
  tool_args: Record<ToolCallName, ToolCallArgs> // key => ToolCallName value => ToolCallArgs
}
