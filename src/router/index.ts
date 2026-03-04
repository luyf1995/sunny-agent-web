import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import { staticRoutes } from './static-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
})

export default router
