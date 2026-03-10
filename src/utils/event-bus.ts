import { SessionInfo } from '@/api/session/types'

type EventMap = {
  'session:unshift': SessionInfo
}

type EventHandler<T = void> = (payload: T) => void

class EventBus {
  private events: Map<keyof EventMap, EventHandler[]> = new Map()

  on<K extends keyof EventMap>(type: K, handler: EventHandler<EventMap[K]>) {
    if (!this.events.has(type)) {
      this.events.set(type, [])
    }
    this.events.get(type)!.push(handler)
  }

  once<K extends keyof EventMap>(type: K, handler: EventHandler<EventMap[K]>) {
    const wrapHandler: EventHandler<EventMap[K]> = payload => {
      handler(payload)
      this.off(type, wrapHandler)
    }
    this.on(type, wrapHandler)
  }

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

  clear() {
    this.events.clear()
  }
}

const eventBus = new EventBus()

export type { EventMap, EventHandler }
export default eventBus
