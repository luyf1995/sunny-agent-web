import { ToolCallArgs, ToolCallName } from '../chat/tool-call'
import { MessageRoleType } from '../chat/types'
import { PageQuery } from '../common/types'

export interface SessionPageParams extends PageQuery {
  status?: string
}

export enum SessionStatus {
  Active = 'active',
  Arvhived = 'arvhived',
  All = 'all'
}
export enum SessionSource {
  Chat = 'chat',
  Task = 'task'
}

export interface SessionInfo {
  session_id: string
  title: string
  turn_count: number
  status: SessionStatus
  create_at: string
  last_active_at: string
  source: SessionSource
}

export interface SessionDetail {
  session_id: string
  title: string
  has_more: boolean
  messages: SessionMessage[]
}

export interface SessionMessage {
  message_id: string
  role: MessageRoleType
  content: string
  l3_steps: L3Step[]
}

export interface L3Step {
  role: MessageRoleType
  content: string
  step_index: number
  tool_args: Record<ToolCallName, ToolCallArgs>
}

export interface EditSessionParams {
  session_id: string
  title: string
}
