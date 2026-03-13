import { request } from '@/utils/request'
import { AxiosProgressEvent } from 'axios'
import useAppConfig from '@/hooks/use-app-config'
import { PluginInfo, PluginListRes } from './types'

const { apiUrl, apiUrlPrefix } = useAppConfig()

export const UPLOAD_PLUGIN_URL = `${apiUrl + apiUrlPrefix}/plugins/upload`
/**
 * 上传插件
 * @param {FormData} formData
 * @param {Object} onUploadProgress
 */
export const uploadPlugin = (formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) =>
  request({
    method: 'post',
    url: `/plugins/upload`,
    data: formData,
    onUploadProgress,
    noLoading: true
  })

/**
 * 查询插件
 */
export const getPluginList = () => {
  return request<PluginListRes>({
    url: `/plugins/list`,
    method: 'get'
  })
}

/**
 * 删除插件
 * @param {string} pluginName 插件名称
 */
export const deletePlugin = (pluginName: string) => {
  return request({
    url: `/plugins/${pluginName}`,
    method: 'delete'
  })
}

/**
 * 启用/禁用插件
 * @param {string} pluginName 插件名称
 * @param {boolean} active 是否启用
 */
export const enablePlugin = (pluginName: string, active: boolean) => {
  return request({
    url: `/plugins/${pluginName}`,
    method: 'patch',
    data: {
      is_active: active
    }
  })
}

/**
 * 查询插件详情
 * @param {string} pluginName 插件名称
 */
export const getPluginFiles = (pluginName: string) => {
  return request<PluginInfo>({
    url: `/plugins/${pluginName}/files`,
    method: 'get'
  })
}
