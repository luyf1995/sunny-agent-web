import request from '@/utils/request'
import { CreateUserParams, UserInfo, CurrentUserInfo } from './types'
import { AxiosPromise } from 'axios'
import { PageResult } from '../common/types'
import { QueryUserParams } from './types'

/**
 * 获取当前用户信息
 */
export const getCurrentUserInfo = (): Promise<CurrentUserInfo> =>
  request({
    method: 'get',
    url: '/api/users/me'
  })

/**
 * 获取用户列表
 * @param {QueryUserParams} params
 */
export const getUserList = (params: QueryUserParams): AxiosPromise<PageResult<UserInfo[]>> =>
  request({
    method: 'get',
    url: '/api/users',
    params
  })

/**
 * 创建用户
 */
export const createUser = (params: CreateUserParams): AxiosPromise<void> =>
  request({
    method: 'post',
    url: '/api/users',
    data: params
  })

/**
 * 删除用户
 * @param {number} id 用户id
 */
export const deleteUser = (id: number): AxiosPromise<void> =>
  request({
    method: 'delete',
    url: `/api/users/${id}`
  })
