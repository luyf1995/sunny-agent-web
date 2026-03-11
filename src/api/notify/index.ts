import { request } from '@/utils/request'
import useAppConfig from '@/hooks/use-app-config'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { apiUrl, apiUrlPrefix } = useAppConfig()

/**
 * 通知接收SSE地址
 */
export const buildNotifySseUrl = () => `${apiUrl + apiUrlPrefix}/notifications/stream?token=${userStore.accessToken}`
