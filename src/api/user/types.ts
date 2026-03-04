import { PageQuery } from '../common/types'

// 用户信息
export interface UserInfo {
  id: string
  usernumb: string // 工号
  username: string // 用户名
  email: string // 邮箱
  company: string // 公司
  department: string // 部门
  role: string // 角色
}

// 用户列表查询参数
export interface QueryUserParams extends PageQuery {
  company?: string // 公司
  department?: string // 部门
}

// 创建用户参数
export interface CreateUserParams {
  usernumb: string // 工号
  username: string // 用户名
  // email?: string // 邮箱
  // company?: string // 公司
  // department?: string // 部门
  // phone?: string // 手机号码
  role: string // 角色
}
