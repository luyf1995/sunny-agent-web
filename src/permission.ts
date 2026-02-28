import router from './router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import pinia, { useUserStore } from './store'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404']
const userStore = useUserStore(pinia)

router.beforeEach(async (to: any, from: any, next: any) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = !!userStore.token
  console.log('hasToken', hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/', replace: true })
      NProgress.done()
    } else {
      next()
    }
  } else if (whiteList.includes(to.path)) {
    next()
  } else {
    next('/login')
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
