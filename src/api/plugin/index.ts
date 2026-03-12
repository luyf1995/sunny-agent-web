import { request } from '@/utils/request'
import { AxiosProgressEvent } from 'axios'
import useAppConfig from '@/hooks/use-app-config'
import { PluginInfo } from './types'

const { apiUrl } = useAppConfig()

export const UPLOAD_PLUGIN_URL = `${apiUrl}/plugins/upload`
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
  return request<PluginInfo[]>({
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
 * @param {string} active 是否启用
 */
export const enablePlugin = (pluginName: string, active: string) => {
  return request({
    url: `/plugins/${pluginName}`,
    method: 'patch',
    params: {
      is_active: active
    }
  })
}
