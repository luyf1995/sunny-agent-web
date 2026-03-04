import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import pinia from '@/store/index'
import router from '@/router/index'
import '@/styles/index.scss'
import './router/guard'

const app = createApp(App)
app.use(router).use(ElementPlus, { locale: zhCn }).use(pinia).mount('#app')
