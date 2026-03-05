export interface RoleInfo {
  id: string
  name: string // 角色名称
  description: string // 角色描述
  permissions: string[]
  created_at: string // 创建时间
}
