import { onUnmounted, isRef, unref, Ref } from 'vue'

interface CustomOptions {
  autoUnbind?: boolean // 组件卸载时自动解绑
}

/**
 * 事件绑定
 * @param {Object} target 事件目标
 * @param {string} type 事件类型
 * @param {Function} handler 事件处理函数
 * @param {Object} options 事件选项（如果需要拓展可以加自定义参数）
 * @returns 手动解绑函数
 */
export function useEventListener<
  T extends HTMLElement | Window | Document = HTMLElement,
  K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
>(
  target: Ref<T | null | undefined> | T | Window | Document | null | undefined,
  type: K | string,
  handler: (event: HTMLElementEventMap[K] | Event) => void,
  options: EventListenerOptions = {},
  customOptions: CustomOptions = { autoUnbind: true }
) {
  // 解绑函数
  const removeListener = () => {
    const el = unref(target)
    if (!el) return
    el.removeEventListener(type, handler, options)
  }

  // 绑定事件
  const addListener = () => {
    const el = unref(target)

    if (!el) return
    el.addEventListener(type, handler, options)
  }

  addListener()

  if (customOptions.autoUnbind) {
    onUnmounted(() => {
      removeListener()
    })
  }

  return { removeListener }
}
