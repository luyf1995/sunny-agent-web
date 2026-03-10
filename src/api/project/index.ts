import request from '@/utils/request'
import { ProjectInfo, SaveProjectParams, FileInfo, ProjectPageParams, ProjectDetail } from './types'
import { PageResult } from '../common/types'

/**
 * 获取项目列表
 * @param {ProjectPageParams} params 创建项目参数
 */
export const getProjectList = (params?: ProjectPageParams) => {
  return request<PageResult<ProjectInfo[]>>({
    url: `/api/projects`,
    method: 'get',
    params
  })
}

/**
 * 获取项目详情
 * @param {string} projectId 项目ID
 */
export const getProjectDetail = (projectId: string) => {
  return request<ProjectDetail>({
    url: `/api/projects/${projectId}`,
    method: 'get'
  })
}

/**
 * 创建项目
 * @param {SaveProjectParams} params 创建项目参数
 */
export const createProject = (params: SaveProjectParams) => {
  return request({
    url: `/api/projects`,
    method: 'post',
    data: params
  })
}

/**
 * 修改项目
 * @param {string} projectId 项目ID
 * @param {SaveProjectParams} params 修改项目参数
 */
export const updateProject = (projectId: string, params: SaveProjectParams) => {
  return request({
    url: `/api/projects/${projectId}`,
    method: 'put',
    data: params
  })
}

/**
 * 删除项目
 * @param {string} projectId 项目ID
 */
export const deleteProject = (projectId: string) => {
  return request({
    url: `/api/projects/${projectId}`,
    method: 'delete'
  })
}
// 项目文件上传
export const buildUpdateFileUrl = (projectId: string) => {
  return `/api/projects/${projectId}/files`
}

/**
 * 获取项目文件列表
 * @param {string} projectId 项目ID
 */
export const getProjectFiles = (projectId: string) => {
  return request<FileInfo[]>({
    url: `/api/projects/${projectId}/files`,
    method: 'get'
  })
}
/**
 * 删除项目文件
 * @param {string} projectId 项目ID
 * @param {string} fileId 文件ID
 */
export const deleteProjectFile = (projectId: string, fileId: string) => {
  return request<FileInfo[]>({
    url: `/api/projects/${projectId}/files/${fileId}`,
    method: 'delete'
  })
}

/**
 * 获取项目下的会话列表
 * @param {string} projectId 项目ID
 * @param {SessionPageParams} params 会话列表查询参数
 */
export const getProjectSessions = (projectId: string, params?: SessionPageParams) =>
  request<ProjectSessionInfo[]>({
    url: `/api/projects/${projectId}/sessions`,
    method: 'get'
  })
