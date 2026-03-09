import { request } from '@/utils/request'

import { PageResult } from '../common/types'
import { ConversationDetail, ConversationInfo, ConversationPageParams, EditConversationParams } from './types'

/**
 * 获取会话列表
 * @param {ConversationPageParams} params
 */
export const getConversationList = (params?: ConversationPageParams) =>
  request.get<PageResult<ConversationInfo[]>>('/api/sessions', {
    params
  })

/**
 * 获取会话详情
 * @param {string} conversationId 会话ID
 */
export const getConversationDetail = (conversationId: string) =>
  request.get<ConversationDetail>(`/api/sessions/${conversationId}/messages`)

/**
 * 删除会话
 * @param {string} conversationId 会话ID
 */
export const deleteConversation = (conversationId: string) => request.delete(`/api/sessions/${conversationId}`)

/**
 * 编辑会话
 * @param {EditConversationParams} params
 */
export const editConversation = (params: EditConversationParams) =>
  request.put(`/api/sessions/${params.session_id}`, params)
