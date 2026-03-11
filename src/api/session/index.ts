import { request } from '@/utils/request'

import { PageResult } from '../common/types'
import { SessionDetail, SessionInfo, SessionPageParams, EditSessionParams } from './types'

/**
 * 获取会话列表
 * @param {SessionPageParams} params 会话列表查询参数
 * @returns 会话列表
 */
export const getSessionList = (params?: SessionPageParams) =>
  request.get<PageResult<SessionInfo[]>>('/sessions', {
    params
  })

/**
 * 获取会话详情
 * @param {string} sessionId 会话id
 * @returns 会话详情
 */
export const getSessionDetail = (sessionId: string) => request.get<SessionDetail>(`/sessions/${sessionId}/messages`)

/**
 * 删除会话
 * @param {string} sessionId 会话id
 * @returns 会话详情
 */
export const deleteSession = (sessionId: string) => request.delete(`/sessions/${sessionId}`)

/**
 * 编辑会话
 * @param {string} sessionId 会话id
 * @param {EditSessionParams} params 编辑会话参数
 * @returns 会话详情
 *
 */
export const editSession = (sessionId: string, params: EditSessionParams) =>
  request.patch(`/sessions/${sessionId}`, params)
