import { PageQuery } from '../common/types'

export interface ScheduledTaskInfo {
  id: string
  name: string
  description: string
  input_text: string // 提示词
  cron_expr: string
  enabled: boolean
  expires_at: string
  created_at: string
  updated_at: string
}

export interface QueryScheduledTaskParams extends PageQuery {}

export interface SaveScheduledTaskParams {
  name: string
  description: string
  enabled?: boolean
  cron_expr: string
  input_text: string // 提示词
  expires_at: string
}
