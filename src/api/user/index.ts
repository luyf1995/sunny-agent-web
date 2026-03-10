import request from '@/utils/request'
import { CreateUserParams, UserInfo, CurrentUserInfo } from './types'
import { AxiosPromise } from 'axios'
import { PageResult } from '../common/types'
import { QueryUserParams } from './types'

/**
 * 获取当前用户信息
 */
export const getCurrentUserInfo = () =>
  request<CurrentUserInfo>({
    method: 'get',
    url: '/users/me'
  })

/**
 * 获取用户列表
 * @param {QueryUserParams} params
 */
export const getUserList = (params: QueryUserParams) =>
  request<PageResult<UserInfo[]>>({
    method: 'get',
    url: '/users',
    params
  })

/**
 * 创建用户
 */
export const createUser = (params: CreateUserParams) =>
  request<void>({
    method: 'post',
    url: '/users',
    data: params
  })

/**
 * 删除用户
 * @param {number} id 用户id
 */
export const deleteUser = (id: number) =>
  request<void>({
    method: 'delete',
    url: `/users/${id}`
  })
