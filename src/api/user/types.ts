import { PageQuery } from '../common/types'

// 用户信息
export interface CurrentUserInfo {
  id: string
  usernumb: string // 工号
  username: string // 用户名
  email: string // 邮箱
  company: string // 公司
  department: string // 部门
  role: RoleInfo // 角色
}

// 角色信息
export interface RoleInfo {
  id: string
  name: string // 角色名称
  description: string // 角色描述
}

// 用户列表查询参数
export interface QueryUserParams extends PageQuery {
  company?: string // 公司
  department?: string // 部门
}

export interface UserInfo {
  id: string
  usernumb: string // 工号
  username: string // 用户名
  email: string // 邮箱
  company: string // 公司
  department: string // 部门
  role: RoleInfo // 角色

  created_at: string // 创建时间
}

// 创建用户参数
export interface CreateUserParams {
  usernumb: string // 工号
  username: string // 用户名
  // email?: string // 邮箱
  // company?: string // 公司
  // department?: string // 部门
  // phone?: string // 手机号码
  role_id: string // 角色id
}
