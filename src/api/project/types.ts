import { PageQuery } from '../common/types'

export interface ProjectFileInfo {
  id: string
  file_name: string
  file_size: number
  mime_type: string
  file_extension: string
  file_context: string
  description: string
}

export interface ProjectInfo {
  id: string
  name: string
  file_count: number // 文件数量
  session_count: number // 会话数量
  owner_id: string // 所有者ID
  created_at: string // 创建时间
  updated_at: string // 更新时间
}

export interface ProjectDetail extends ProjectInfo {}

export interface ProjectPageParams extends PageQuery {
  // name?: string
}

export interface SaveProjectParams {
  id?: string
  name: string
}

// 会话列表查询参数

export interface SessionPageParams extends PageQuery {
  // name?: string
}

export interface ProjectSessionInfo {
  id: string
  title: string
  project_id: string
  session_id: string
  user_id: string
  status: string
  created_at: string // 创建时间
  updated_at: string // 更新时间
}
