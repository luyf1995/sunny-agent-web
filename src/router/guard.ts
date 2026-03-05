import router from './index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import pinia, { useUserStore } from '@/store'
import axios from 'axios'
import { getUrlParams } from '@/utils/url'

NProgress.configure({ showSpinner: false })

const whiteList = ['/404', '/401', '/sso']

router.beforeEach(async (to: any, from: any, next: any) => {
  const userStore = useUserStore(pinia)

  // debugger
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  // next()
  const ticket = getUrlParams(window.location.href, 'ticket') as string
  const hasToken = !!userStore.accessToken
  if (whiteList.includes(to.path)) {
    next()
  } else if (hasToken) {
    next()
  } else if (ticket) {
    // 从sso登录后跳转回来
    try {
      if (to.path === '/sso') {
        next()
      } else {
        next({ path: '/sso', replace: true })
      }
    } catch (error) {
      console.error('ticket认证失败', error)
      next({ path: '/401', replace: true })
    }
  } else {
    userStore.login()
    NProgress.done()
    return
  }
})

router.afterEach(() => {
  NProgress.done()
})
