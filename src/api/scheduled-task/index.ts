import request from '@/utils/request'
import { QueryExecutedTaskParams, SaveScheduledTaskParams, ScheduledTaskInfo } from './types'
import { PageResult } from '../common/types'
import { QueryScheduledTaskParams } from './types'

/**
 * 获取定时任务列表
 * @param {QueryScheduledTaskParams} params
 */
export const getScheduledTaskList = (params: QueryScheduledTaskParams) =>
  request<PageResult<ScheduledTaskInfo[]>>({
    method: 'get',
    url: '/cron-jobs',
    params
  })
/**
 * 获取已完成任务列表
 * @param {QueryExecutedTaskParams} params
 */
export const getExecutedTaskList = (params: QueryExecutedTaskParams) =>
  request<PageResult<ScheduledTaskInfo[]>>({
    method: 'get',
    url: '/cron-jobs/executions',
    params
  })
/**
 * 创建定时任务
 * @param {SaveScheduledTaskParams} params
 */
export const createScheduledTask = (params: SaveScheduledTaskParams) =>
  request<void>({
    method: 'post',
    url: '/cron-jobs',
    data: params
  })
/**
 * 编辑定时任务
 * @param {number} id 定时任务id
 * @param {SaveScheduledTaskParams} params
 */
export const editScheduledTask = (id: string, params: SaveScheduledTaskParams) =>
  request<void>({
    method: 'patch',
    url: `/cron-jobs/${id}`,
    data: params
  })

/**
 * 删除定时任务
 * @param {string} id 定时任务id
 */
export const deleteScheduledTask = (id: string) =>
  request<void>({
    method: 'delete',
    url: `/cron-jobs/${id}`
  })
