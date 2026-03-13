import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import useAppStore from './app'
import useUserStore from './user'
import useModuleStore from './module'
import useCommandStore from './command'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
export { useAppStore, useUserStore, useModuleStore, useCommandStore }
