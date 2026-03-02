import { ref, createApp, h } from 'vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import Dialog from './index.vue'
import { ImperativeOptions } from './types'
import { DEFAULT_OPTIONS } from './config'

export const openDialog = (options?: ImperativeOptions) => {
  const dialogOptions = { ...DEFAULT_OPTIONS, ...options }
  const visible = ref(true)

  const container = document.createElement('div')
  document.body.appendChild(container)

  const close = () => {
    dialogApp?.unmount()
    document.body.removeChild(container)
  }
  const dialogApp = createApp({
    setup() {
      return () =>
        h(
          Dialog,
          {
            ...dialogOptions,
            modelValue: visible.value,
            'onUpdate:modelValue': val => (visible.value = val),
            onClosed: () => {
              dialogOptions.onClosed?.()
              close()
            }
          },
          {
            header() {
              if (typeof dialogOptions.header === 'function') {
                return dialogOptions.header()
              }
              return dialogOptions.header || null
            },
            default() {
              if (typeof dialogOptions.content === 'function') {
                return dialogOptions.content()
              }
              return dialogOptions.content || null
            },
            footer() {
              if (typeof dialogOptions.footer === 'function') {
                return dialogOptions.footer()
              }
              return dialogOptions.footer || null
            }
          }
        )
    }
  })
  dialogApp.use(ElementPlus, { locale: zhCn })
  dialogApp.mount(container)
  return {
    app: dialogApp,
    close: () => {
      visible.value = false
    }
  }
}
