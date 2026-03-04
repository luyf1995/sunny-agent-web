import { RouteRecordRaw } from 'vue-router'

export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/sso',
    component: () => import('@/views/sso/index.vue')
  },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index.vue')
  // },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      hidden: true
    }
  }
]
