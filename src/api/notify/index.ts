import { request } from '@/utils/request'
import useAppConfig from '@/hooks/use-app-config'
import { useUserStore } from '@/store'
import { NotifyInfo, NotifyListItem } from './types'

const userStore = useUserStore()
const { apiUrl, apiUrlPrefix } = useAppConfig()

/**
 * 通知接收SSE地址
 */
export const buildNotifySseUrl = () => `${apiUrl + apiUrlPrefix}/notifications/stream?token=${userStore.accessToken}`

/**
 * 获取通知列表
 */
export const getNotifyList = () =>
  request<NotifyListItem>({
    url: `/notifications`,
    method: 'get'
  })

/**
 * 读取通知
 * @param {string} id 通知ID
 */
export const readNotify = (id: string) =>
  request({
    url: `/notifications/${id}/read`,
    method: 'patch'
  })
