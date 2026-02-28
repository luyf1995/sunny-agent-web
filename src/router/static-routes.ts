import { RouteRecordRaw } from 'vue-router'

export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  }
]
export const noFoundRoute = {
  path: '/:catchAll(.*)',
  name: '404',
  component: () => import('@/views/404.vue'),
  meta: {
    hidden: true
  }
}
