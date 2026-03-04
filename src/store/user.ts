import { defineStore } from 'pinia'
import { loginBySSO, logout, logoutBySSO, verifySSOTicket } from '@/api/auth'
import { UserInfo } from '@/api/user/types'

interface UserState {
  accessToken: string
  refreshToken: string
  userInfo: UserInfo | null
}

const userStore = defineStore('user', {
  persist: true,
  state: (): UserState => {
    return {
      accessToken: '',
      refreshToken: '',
      userInfo: null
    }
  },
  actions: {
    /**
     * 设置Token
     * @param {String} accessToken
     * @param {string} refreshToken
     */
    setToken(accessToken: string, refreshToken: string) {
      this.setAccessToken(accessToken)
      this.setRefreshToken(refreshToken)
    },
    /**
     * 设置accessToken
     * @param {String} accessToken
     */
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },
    /**
     * refreshToken
     * @param {String} refreshToken
     */
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
    /**
     * 验证sso ticket
     * @param {string} ticket
     * @param {string} service
     */
    verifySSOTicket(ticket: string, service?: string) {
      return verifySSOTicket(ticket, service).then(({ data }) => {
        this.setToken(data.access_token, data.refresh_token)
        this.setUserInfo(data.user)
        return data
      })
    },
    /**
     * 登录
     */
    login() {
      loginBySSO()
    },
    /**
     * 登出
     */
    logout() {
      this.removeToken()
      this.setUserInfo(null)
      logoutBySSO()
    },

    /**
     * 设置用户信息
     * @param {UserInfo | null} userInfo
     */
    setUserInfo(userInfo: UserInfo | null) {
      this.userInfo = userInfo
    },
    /**
     * 移除token
     */
    removeToken() {
      this.setAccessToken('')
      this.setRefreshToken('')
      this.setUserInfo(null)
    }
  }
})

export default userStore
