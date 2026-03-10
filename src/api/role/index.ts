import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { RoleInfo } from './types'

/**
 * 获取用户列表
 */
export const getRoleList = () =>
  request<{ items: RoleInfo[] }>({
    method: 'get',
    url: '/api/roles'
  })
