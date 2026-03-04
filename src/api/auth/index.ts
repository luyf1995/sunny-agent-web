import { AxiosPromise } from 'axios'
import { TicketRes } from './types'
import request from '@/utils/request'
import useAppConfig from '@/hooks/use-app-config'
import { removeUrlHash } from '@/utils/url'

const { ssoLoginUrl, ssoLogoutUrl } = useAppConfig()

export const SSO_SERVICE = window.location.protocol + '//' + window.location.host + '/sso'

/**
 * SSO登录
 */
export const loginBySSO = () => {
  try {
    window.location.href = ssoLoginUrl + '?service=' + SSO_SERVICE
  } catch (error) {
    console.error('跳转SSO登录失败', error)
  }
}
/**
 * SSO登出
 */
export const logoutBySSO = () => {
  window.location.href = ssoLogoutUrl
}

/**
 * sso验证ticket接口
 * @param {string} ticket sso登录返回的ticket
 * @param {string} service 服务地址
 */
export const verifySSOTicket = (ticket: string, service: string = SSO_SERVICE): AxiosPromise<TicketRes> =>
  request({
    method: 'get',
    url: '/auth/sso/callback',
    params: {
      ticket,
      service
    }
  })

/**
 * 登出
 */
export const logout = () =>
  request({
    method: 'post',
    url: '/auth/logout'
  })
