import { defineStore } from 'pinia'
import { Session } from '@/utils/storage'
// import { login, logout } from '@/api/system/user'

interface UserState {
  token: string
  userInfo: null
}

const userStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: Session.get('token'),
      userInfo: null
    }
  },
  actions: {
    /**
     * 设置Token
     * @param {String} token
     */
    setToken(token: string) {
      this.token = token
      Session.set('token', token)
    },
    /**
     * 获取用户信息
     */
    getUserInfo(): Promise<UserInfo> {
      return new Promise((resolve, reject) => {
        // getUserInfo()
        //   .then(({ data }) => {
        //     this.setUserInfo(data)
        //     resolve(data)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
        resolve()
      })
    },
    /**
     * 设置用户信息
     * @param {UserInfo} userInfo
     */
    setUserInfo(userInfo: UserInfo | null) {
      this.userInfo = userInfo
      Session.set('userInfo', userInfo)
    },
    /**
     * 登录
     * @param {Login} loginForm
     */
    login(loginForm: Login) {
      return new Promise((resolve, reject) => {
        // login(params).then(({ data }) => {
        const token = 'xxxx'
        this.setToken(token)
        resolve(token)
        // })
      })
    },
    /**
     * 登出
     */
    logout() {
      return new Promise((resolve, reject) => {
        // logout()
        //   .then(() => {
        //     this.removeToken()
        //     this.removeUserInfo()
        //     resolve(null)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
      })
    },
    /**
     * 前端登出
     * @param {Boolean} needClear 是否需要清空sessionStorage中的信息
     */
    logoutByFrontEnd(needClear = true) {
      if (needClear) {
        this.removeToken()
        this.removeUserInfo()
      }
    },
    /**
     * 移除Token
     * @return {Promise}
     */
    removeToken() {
      this.setToken('')
      Session.remove('token')
    },
    /**
     * 移除用户信息
     * @return {Promise}
     */
    removeUserInfo() {
      this.setUserInfo(null)
    }
  }
})

export default userStore
