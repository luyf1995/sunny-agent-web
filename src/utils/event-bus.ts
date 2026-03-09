import { ConversationInfo } from '@/api/conversation/types'

type EventMap = {
  'conversation:unshift': ConversationInfo // 新建对话
}

type EventHandler<T = void> = (payload: T) => void

class EventBus {
  private events: Map<keyof EventMap, EventHandler[]> = new Map()

  /**
   * 监听事件
   * @param {string} type 事件名
   * @param {EventHandler<EventMap[K]>} handler 回调函数（参数类型自动推导）
   */
  on<K extends keyof EventMap>(type: K, handler: EventHandler<EventMap[K]>) {
    if (!this.events.has(type)) {
      this.events.set(type, [])
    }
    this.events.get(type)!.push(handler)
  }

  /**
   * 监听一次事件（触发后自动移除）
   * @param {string} type 事件名
   * @param {EventHandler<EventMap[K]>} handler 回调函数
   */
  once<K extends keyof EventMap>(type: K, handler: EventHandler<EventMap[K]>) {
    const wrapHandler: EventHandler<EventMap[K]> = payload => {
      handler(payload)
      this.off(type, wrapHandler)
    }
    this.on(type, wrapHandler)
  }

  /**
   * 触发事件
   * @param {string} type 事件名
   * @param {EventMap[K]} payload 事件参数
   */
  emit<K extends keyof EventMap>(type: K, payload?: EventMap[K]) {
    const handlers = this.events.get(type)
    if (handlers) {
      ;[...handlers].forEach(handler => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`EventBus 执行 ${String(type)} 事件出错:`, error)
        }
      })
    }
  }

  /**
   * 取消事件监听
   * @param {string} type 事件名
   * @param {EventHandler<EventMap[K]>} handler 要移除的回调
   */
  off<K extends keyof EventMap>(type: K, handler?: EventHandler<EventMap[K]>) {
    const handlers = this.events.get(type)
    if (!handlers) return

    if (handler) {
      const index = handlers.findIndex(h => h === handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    } else {
      this.events.set(type, [])
    }
  }

  /**
   * 清空所有事件监听
   */
  clear() {
    this.events.clear()
  }
}

const eventBus = new EventBus()

export type { EventMap, EventHandler }
export default eventBus
