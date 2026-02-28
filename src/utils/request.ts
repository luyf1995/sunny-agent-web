import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import useAppConfig from '@/hooks/use-app-config'

const { apiUrl, apiUrlPrefix } = useAppConfig()

// 业务状态码
export enum Code {
  SUCCCESS = 200,
  ERROR = 500,
  UNAUTHORIZED = 401 // token 失效
}

export interface IResponse<T = any> {
  code: number
  message: string
  data: T
}

let loadingInstance: any
// 请求队列
let queue = new Map()

/**
 * 移除队列中的url并且关闭loading
 * @param {String} url
 */
const removeQueueAndCancelLoading = (url?: string) => {
  if (!url) return
  queue.delete(url)
  if (queue.size === 0) {
    loadingInstance && loadingInstance.close()
  }
}

export const request = axios.create({
  baseURL: apiUrl + apiUrlPrefix,
  // withCredentials: true,
  timeout: 50000
})

/**
 * 显示el-message
 * @param {string} message
 * @param {string} type
 */
const showElMessage = (message = '网络连接失败，请联系管理员', type = 'error') => {
  let option: any = {
    message: message,
    type,
    grouping: true,
    showClose: true
  }
  ElMessage(option)
}

// 请求拦截
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const { baseURL, url, noLoading } = config
    if (!noLoading) {
      if (queue.size === 0) {
        loadingInstance = ElLoading.service({
          fullscreen: true,
          text: '加载中',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      if (baseURL && url) {
        queue.set(baseURL + url, true)
      }
    }

    return config
  },
  error => {
    removeQueueAndCancelLoading(error.config.url)
    return Promise.reject(error)
  }
)

// 响应拦截
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { baseURL, url } = response.config
    if (baseURL && url) {
      removeQueueAndCancelLoading(baseURL + url)
    }

    const { code, message }: IResponse = response.data
    // 文件流
    if (code === Code.SUCCCESS) {
      return response.data
    } else {
      showElMessage(message)
      return Promise.reject(response.data)
    }
  },
  error => {
    const { baseURL, url } = error.config
    const { status, data } = error.response || {}

    const mainUrl = url.split('?')[0]
    removeQueueAndCancelLoading(baseURL + mainUrl)

    if (!status) {
      showElMessage()
    } else {
      // 非取消请求的报错需要弹框展示
      if (!(error instanceof axios.Cancel)) {
        showElMessage(data.message)
      }
    }
    return Promise.reject(error)
  }
)

export default request
