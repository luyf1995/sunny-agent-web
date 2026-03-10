import request from '@/utils/request'
import {
  ProjectInfo,
  SaveProjectParams,
  ProjectFileInfo,
  ProjectPageParams,
  ProjectDetail,
  SessionPageParams,
  ProjectSessionInfo
} from './types'
import { PageQuery, PageResult } from '../common/types'
import { AxiosProgressEvent } from 'axios'

/**
 * 获取项目列表
 * @param {ProjectPageParams} params 创建项目参数
 */
export const getProjectList = (params?: ProjectPageParams) => {
  return request<PageResult<ProjectInfo[]>>({
    url: `/projects`,
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
    url: `/projects/${projectId}`,
    method: 'get'
  })
}

/**
 * 创建项目
 * @param {SaveProjectParams} params 创建项目参数
 */
export const createProject = (params: SaveProjectParams) => {
  return request({
    url: `/projects`,
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
    url: `/projects/${projectId}`,
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
    url: `/projects/${projectId}`,
    method: 'delete'
  })
}
// // 项目文件上传
// export const buildUpdateFileUrl = (projectId: string) => {
//   return `/projects/${projectId}/files`
// }

/**
 * 上传文件
 * @param {string} projectId 项目ID
 * @param {FormData} formData 上传文件表单数据
 * @param {Object} onUploadProgress 上传进度回调
 */
export const uploadProjectFiles = (
  projectId: string,
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) =>
  request({
    method: 'post',
    url: `/projects/${projectId}/files`,
    data: formData,
    onUploadProgress,
    noLoading: true
  })

/**
 * 获取项目文件列表
 * @param {string} projectId 项目ID
 * @param {PageQuery} params 分页查询参数
 */
export const getProjectFiles = (projectId: string, params?: PageQuery) => {
  return request<PageResult<ProjectFileInfo[]>>({
    url: `/projects/${projectId}/files`,
    method: 'get',
    params
  })
}
/**
 * 删除项目文件
 * @param {string} projectId 项目ID
 * @param {string} fileId 文件ID
 */
export const deleteProjectFile = (projectId: string, fileId: string) => {
  return request<ProjectFileInfo[]>({
    url: `/projects/${projectId}/files/${fileId}`,
    method: 'delete'
  })
}

/**
 * 获取项目下的会话列表
 * @param {string} projectId 项目ID
 * @param {SessionPageParams} params 会话列表查询参数
 */
export const getProjectSessions = (projectId: string, params?: SessionPageParams) =>
  request<PageResult<ProjectSessionInfo[]>>({
    url: `/projects/${projectId}/sessions`,
    method: 'get',
    params
  })

/**
 * 移动会话到项目
 * @param {string} projectId 项目id
 * @param {string} sessionId 会话id
 */
export const moveSessionToProject = (projectId: string, sessionId: string) =>
  request.post(`/projects/${projectId}/sessions/${sessionId}`)

/**
 * 从项目移除会话
 * @param {string} projectId 项目id
 * @param {string} sessionId 会话id
 */
export const removeSessionFromProject = (projectId: string, sessionId: string) =>
  request.delete(`/projects/${projectId}/sessions/${sessionId}`)
